(function (window) {
  const Formloop = {
    init(formEl, options = {}) {
      const steps = [...formEl.querySelectorAll('[data-form="step"]')];
      let currentStep = 0;

      const showStep = (index) => {
        steps.forEach((step, i) => {
          step.style.display = i === index ? "block" : "none";
        });
      };

      const validateCurrentStep = () => {
        const stepEl = steps[currentStep];
        const inputs = stepEl.querySelectorAll("input, select, textarea");

        const mode = (
          formEl.getAttribute("data-validation-mode") || "native"
        ).toLowerCase();

        let isValid = true;
        let firstInvalid = null;

        // reset per-run state
        inputs.forEach((input) => {
          input.classList.remove("formloop-error");
          input.removeAttribute("aria-invalid");
        });
        // hide all custom error blocks up front
        stepEl
          .querySelectorAll('[data-validation="error"]')
          .forEach((b) => (b.style.display = "none"));

        const processedNames = new Set();

        const markInvalid = (el, errorEl) => {
          isValid = false;
          if (!firstInvalid) firstInvalid = el;
          if (mode === "custom") {
            if (errorEl) errorEl.style.display = "block";
            el.classList.add("formloop-error");
            el.setAttribute("aria-invalid", "true");
          }
        };

        inputs.forEach((input) => {
          const type = (input.type || "").toLowerCase();
          const name = input.name || "";
          const key = name || input.id || "";
          const errorSel = key
            ? `[data-validation="error"][data-for="${CSS.escape(key)}"]`
            : null;
          const errorEl = errorSel ? stepEl.querySelector(errorSel) : null;

          // === NEW: checkbox group handling (exactly one must be selected) ===
          if (type === "checkbox" && name) {
            // consider checkboxes with the same name within THIS step a group
            const group = stepEl.querySelectorAll(
              `input[type="checkbox"][name="${CSS.escape(name)}"]`
            );
            if (group.length > 1) {
              if (processedNames.has(name)) return;
              processedNames.add(name);

              const checkedCount = Array.from(group).filter(
                (cb) => cb.checked
              ).length;
              const valid = checkedCount === 1;

              // keep native validity coherent so reportValidity() shows a message
              group[0].setCustomValidity(
                valid ? "" : "Please select exactly one option."
              );

              if (!valid) {
                // mark only the first checkbox for visuals/focus and show the group's error block
                markInvalid(group[0], errorEl);
              }
              return; // group processed
            }
            // single checkbox: fall through to native validity
          }
          // === END NEW checkbox logic ===

          // everything else (including radios) stays as-is: native validity
          const valid = input.checkValidity();
          if (!valid) {
            markInvalid(input, errorEl);
          }
        });

        if (!isValid) {
          if (mode === "native") {
            if (
              firstInvalid &&
              typeof firstInvalid.reportValidity === "function"
            ) {
              firstInvalid.reportValidity();
            } else if (typeof formEl.reportValidity === "function") {
              formEl.reportValidity();
            }
          } else {
            if (firstInvalid) firstInvalid.focus();
          }
          return false;
        }

        return true;
      };

      // Remove the delegated click handler and use discrete listeners:
      const nextButtons = formEl.querySelectorAll('[data-form="next-btn"]');
      const backButtons = formEl.querySelectorAll('[data-form="back-btn"]');
      const submitBtn = formEl.querySelector('[data-form="submit-btn"]');

      // NEXT
      nextButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (validateCurrentStep()) {
            currentStep = Math.min(currentStep + 1, steps.length - 1);
            showStep(currentStep);
          }
        });
      });

      // BACK
      backButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          currentStep = Math.max(currentStep - 1, 0);
          showStep(currentStep);
        });
      });

      // SUBMIT
      if (submitBtn) {
        submitBtn.addEventListener("click", (e) => {
          if (!formEl.checkValidity()) {
            e.preventDefault();
            validateCurrentStep();
          }
        });
      }

      showStep(currentStep);

      // Enforce single-select behavior for checkbox groups sharing the same name
      const allCheckboxes = formEl.querySelectorAll(
        'input[type="checkbox"][name]'
      );
      const checkboxGroups = new Map();

      allCheckboxes.forEach((cb) => {
        const name = cb.name;
        if (!checkboxGroups.has(name)) checkboxGroups.set(name, []);
        checkboxGroups.get(name).push(cb);
      });

      checkboxGroups.forEach((group) => {
        if (group.length > 1) {
          group.forEach((cb) => {
            cb.addEventListener("change", () => {
              if (cb.checked) {
                // uncheck all others in the same group
                group.forEach((other) => {
                  if (other !== cb) other.checked = false;
                });
              }
              // keep native validity in sync for the group (exactly one)
              const exactlyOne = group.filter((x) => x.checked).length === 1;
              // attach the message to the first control so reportValidity() works
              group[0].setCustomValidity(
                exactlyOne ? "" : "Please select exactly one option."
              );
            });
          });
        }
      });
    },

    autoInit() {
      document.querySelectorAll('[data-form="multi-step"]').forEach((form) => {
        Formloop.init(form);
      });
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => Formloop.autoInit());
  } else {
    Formloop.autoInit();
  }

  window.Formloop = Formloop;
})(window);
