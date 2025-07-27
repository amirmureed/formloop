# Formloop

**Formloop** is a lightweight, dependency-free JavaScript library that makes it easy to create multi-step forms — perfect for Webflow, static HTML, or custom websites.

> No frameworks. No setup. Just drop in and go.

---

## 🔗 CDN Usage

Use the library directly via [jsDelivr CDN](https://www.jsdelivr.com/):

```html
<script src="https://cdn.jsdelivr.net/gh/amirmureed/formloop@v1.0.0/dist/formloop.min.js"></script>
```

To always use the latest version:

```html
<script src="https://cdn.jsdelivr.net/gh/amirmureed/formloop/dist/formloop.min.js"></script>
```

---

## 🚀 Features

- 🎯 Zero config – works via `data-form` attributes
- ✅ Step-by-step form handling
- ❌ Field validation and inline error support
- 🔁 Supports back/next navigation
- 🧠 Works great in Webflow and static sites

---

## ✨ Getting Started

### HTML Structure

```html
<form data-form="multi-step">
  <div data-form="step">
    <input type="text" name="name" required />
    <p data-validation="error" data-for="name">Name is required</p>
    <button type="button" data-form="next-btn">Next</button>
  </div>

  <div data-form="step">
    <input type="email" name="email" required />
    <p data-validation="error" data-for="email">Valid email is required</p>
    <button type="button" data-form="back-btn">Back</button>
    <button type="submit" data-form="submit-btn">Submit</button>
  </div>
</form>

<script src="https://cdn.jsdelivr.net/gh/amirmureed/formloop/dist/formloop.min.js"></script>
```

---

## 🧩 Supported Data Attributes

| Attribute                 | Purpose                             |
| ------------------------- | ----------------------------------- |
| `data-form="multi-step"`  | Applied to the `<form>` element     |
| `data-form="step"`        | Wrapper for each form step          |
| `data-form="next-btn"`    | Next step trigger                   |
| `data-form="back-btn"`    | Previous step trigger               |
| `data-form="submit-btn"`  | Final submit trigger                |
| `data-validation="error"` | Error message block (optional)      |
| `data-for="input-name"`   | Must match input's `name` attribute |

---

## 💡 Examples

Check out the `/demo/index.html` file in this repo for a full working job application form.

---

## 📜 License

MIT © [South Digital](https://www.south.digital/)
