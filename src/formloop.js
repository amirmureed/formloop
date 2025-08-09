(function (window) {
  const Formloop = {
    init(formEl, options = {}) {
      const steps = [...formEl.querySelectorAll('[data-form="step"]')];
      let currentStep = 0;

      const showStep = (index) => {
        steps.forEach((step, i) => {
          step.style.display = i === index ? 'block' : 'none';
        });
      };

      const validateCurrentStep = () => {
        const inputs = steps[currentStep].querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach((input) => {
          const errorEl = input.closest('[data-form="step"]').querySelector('[data-validation="error"][data-for="' + input.name + '"]');
          if (!input.checkValidity()) {
            isValid = false;
            if (errorEl) errorEl.style.display = 'block';
          } else {
            if (errorEl) errorEl.style.display = 'none';
          }
        });

        return isValid;
      };

      formEl.addEventListener('click', (e) => {
        const isNext = e.target.matches('[data-form="next-btn"]');
        const isBack = e.target.matches('[data-form="back-btn"]');

        if (isNext) {
          e.preventDefault();
          if (validateCurrentStep()) {
            currentStep = Math.min(currentStep + 1, steps.length - 1);
            showStep(currentStep);
          }
        }

        if (isBack) {
          e.preventDefault();
          currentStep = Math.max(currentStep - 1, 0);
          showStep(currentStep);
        }

        if (isSubmit && !validateCurrentStep()) {
          e.preventDefault(); // prevent submit if invalid
        }
      });

      formEl.addEventListener('submit', (e) => {
        if (!validateCurrentStep()) {
          e.preventDefault();
        }
      });

      showStep(currentStep);
    },

    autoInit() {
      document.querySelectorAll('[data-form="multi-step"]').forEach((form) => {
        Formloop.init(form);
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Formloop.autoInit());
  } else {
    Formloop.autoInit();
  }

  window.Formloop = Formloop;
})(window);
