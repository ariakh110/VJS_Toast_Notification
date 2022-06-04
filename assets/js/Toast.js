const DEFAULT_OPTIONS = {
  autoClose: 3000,
  position: "top-right",
  onClose: () => {},
  showProgress: true,
};

export default class Toast {
  #toastElem;
  #autoCloseInterval;
  #progressInterval;
  #timeVisible = 0;
  #autoClose;
  #isPaused = false;
  #pause;
  #resume;
  #visibilitychange;
  #shouldResume;

  constructor(options) {
    console.log("constructor");
    this.#toastElem = document.createElement("div");
    this.#toastElem.classList.add("toast");
    requestAnimationFrame(() => {
      this.#toastElem.classList.add("show");
    });

    this.#pause = () => {
      this.#isPaused = true;
    };
    this.#resume = () => {
      this.#isPaused = false;
    };
    this.#visibilitychange = () => {
      this.#shouldResume = document.visibilityState === "visible";
    };
    // this.#removeBinded = this.remove.bind(this);
    this.update({ ...DEFAULT_OPTIONS, ...options });
  }

  set position(value) {
    console.log("set pos");

    const currentContainer = this.#toastElem.parentElement;
    const selector = `.toast-container[data-position="${value}"]`;
    const container =
      document.querySelector(selector) || createContainer(value);
    container.append(this.#toastElem);
    if (currentContainer == null || currentContainer.hasChildNodes()) return;
    currentContainer.remove();
  }

  set text(value) {
    console.log("set text");
    this.#toastElem.textContent = value;
  }
  //auto close
  set autoClose(duration) {
    console.log("aclose");
    this.#autoClose = duration;
    this.#timeVisible = 0;

    if (duration === false) return;

    let lastTime;
    const func = (time) => {
      if (this.#shouldResume) {
        lastTime = time;
        this.#shouldResume = false;
      }
      if (lastTime == null) {
        lastTime = time;
        this.#autoCloseInterval = requestAnimationFrame(func);
        return;
      }
      if (!this.#isPaused) {
        this.#timeVisible += time - lastTime;
        if (this.#timeVisible >= this.#autoClose) {
          this.remove();
          return;
        }
      }
      lastTime = time;
      this.#autoCloseInterval = requestAnimationFrame(func);
    };
    this.#autoCloseInterval = requestAnimationFrame(func);
  }
  set canClose(value) {
    this.#toastElem.classList.toggle("can-close", value);
    if (value) this.#toastElem.addEventListener("click", () => this.remove());
    else this.#toastElem.removeEventListener("click", () => this.remove());
  }

  set showProgress(value) {
    this.#toastElem.classList.toggle("progress", value);
    this.#toastElem.style.setProperty("--progress", 1);
    if (value) {
      const func = () => {
        if (!this.#isPaused) {
          this.#toastElem.style.setProperty(
            "--progress",
            1 - this.#timeVisible / this.#autoClose
          );
        }
        this.#progressInterval = requestAnimationFrame(func);
      };
      this.#progressInterval = requestAnimationFrame(func);
    }
  }
  set pauseOnHover(value) {
    if (value) {
      this.#toastElem.addEventListener("mouseover", this.#pause);
      this.#toastElem.addEventListener("mouseleave", this.#resume);
    } else {
      this.#toastElem.removeEventListener("mouseleave", this.#resume);
      this.#toastElem.removeEventListener("mouseover", this.#pause);
    }
  }
  set pauseOnFocusLoss(value) {
    if (value) {
      document.addEventListener("visibilitychange", this.#visibilitychange);
    } else {
      this.#toastElem.removeEventListener(
        "visibilitychange",
        this.#visibilitychange
      );
    }
  }
  update(options) {
    console.log("upadte");
    Object.entries(options).forEach(([key, value]) => {
      this[key] = value;
    });
  }
  remove() {
    console.log("remove");
    cancelAnimationFrame(this.#autoCloseInterval);
    cancelAnimationFrame(this.#progressInterval);
    const container = this.#toastElem.parentElement;
    this.#toastElem.classList.remove("show");
    this.#toastElem.addEventListener("transitionend", () => {
      this.#toastElem.remove();
      if (container.hasChildNodes()) return;
      container.remove();
    });
    this.onClose();
  }
}

const createContainer = (position) => {
  console.log("create container");
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
