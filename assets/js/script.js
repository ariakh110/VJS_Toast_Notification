import Toast from "./Toast.js";
document.querySelector("button").addEventListener("click", () => {
  const toast = new Toast({
    text: "Hi",
    autoClose: 3000,
    position: "top-right",
    pauseOnHover: true,
    pauseOnFocusLoss: true,
  });
});
