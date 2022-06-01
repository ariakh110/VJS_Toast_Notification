import Toast from "./Toast.js";

const toast = new Toast({
  position: "top-right",
  text: "Hi",
  autoClose: false,
});
setTimeout(() => {
  toast.remove();
}, 3000);
