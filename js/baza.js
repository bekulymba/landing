const scrollBtn = document.getElementById("scrollToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollBtn.classList.add("show");
    scrollBtn.classList.remove("hide");
  } else {
    scrollBtn.classList.remove("show");
    scrollBtn.classList.add("hide");
  }
});

scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
