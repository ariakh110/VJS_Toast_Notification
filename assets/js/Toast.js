const DEFAULT_OPTIONS = {
  autoClose: 5000,
};

export default class Toast {
  #toastElem;
  #autoCloseTimeout;
  constructor(options) {
    this.#toastElem = document.createElement("div");
    this.#toastElem.classList.add("toast");
    this.update({ ...DEFAULT_OPTIONS, ...options });
  }
  set position(value) {
    const currentContainer = this.#toastElem.parentElement;
    const selector = `.toast-container[data-position="${value}"]`;
    const container =
      document.querySelector(selector) || createContainer(value);
    container.appendChild(this.#toastElem);
    if (currentContainer == null || currentContainer.hasChildNodes()) return;
    currentContainer.remove();
  }
  set text(value) {
    this.#toastElem.textContent = value;
  }
  set autoClose(duration) {
    if (duration === false) return;
    if (this.#autoCloseTimeout != null) clearTimeout(this.#autoCloseTimeout);

    this.#autoCloseTimeout = setTimeout(() => this.remove(), duration);
  }

  //   show() {}
  update(options) {
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value;
    });
  }
  update() {}
  remove() {
    const container = this.#toastElem.parentElement;
    this.#toastElem.remove();
    if (container.hasChildNodes()) return;
    container.remove();
  }
}

const createContainer = (position) => {
  const container = document.createElement("div");
  container.classList.add("toast-container");
  container.dataset.position = position;
  document.body.append(container);
  return container;
};

// show() {
//     const toastElem = document.createElement("div");
//     toastElem.classList.add("toast");
//     toastElem.innerHTML = `
//             <div class="toast-header">
//                 <strong class="mr-auto">${this.title}</strong>
//                 <small>${this.subtitle}</small>
//                 <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
//                     <span aria-hidden="true">&times;</span>
//                 </button>
//             </div>
//             <div class="toast-body">
//                 ${this.message}
//             </div>
//         `;
//     document.body.appendChild(toastElem);
//     toastElem.classList.add("show");
//     toastElem.classList.add("toast-top-right");
//     toastElem.addEventListener("click", () => {
//       toastElem.classList.remove("show");
//     });
//     setTimeout(() => {
//       toastElem.classList.remove("show");
//     }, this.duration);
//   }
