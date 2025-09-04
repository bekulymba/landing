document.addEventListener("DOMContentLoaded", () => {
  const items = Array.from(document.querySelectorAll(".faq__item"));
  if (!items.length) return;

  // утилиты
  const closeItem = (it) => {
    it.classList.remove("faq__item--open");
    const answer = it.querySelector(".faq__answer");
    if (answer) {
      answer.style.maxHeight = null;
      answer.style.paddingTop = null;
    }
    const icon = it.querySelector(".faq__icon img");
    if (icon) icon.src = "images/faq/plus.png";
    const question = it.querySelector(".faq__question");
    if (question) question.setAttribute("aria-expanded", "false");
  };

  const openItem = (it) => {
    it.classList.add("faq__item--open");
    const answer = it.querySelector(".faq__answer");
    if (answer) {
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
    const icon = it.querySelector(".faq__icon img");
    if (icon) icon.src = "images/faq/minus.png";
    const question = it.querySelector(".faq__question");
    if (question) question.setAttribute("aria-expanded", "true");
  };

  items.forEach((it, index) => {
    const row = it.querySelector(".faq__question-row");
    if (!row) return;

    row.setAttribute("tabindex", "0");

    row.addEventListener("click", () => {
      if (it.classList.contains("faq__item--open")) {
        // если открыт — закрыть
        closeItem(it);
      } else {
        // открыть (другие не трогаем!)
        openItem(it);
      }

      // если после клика ВСЕ закрыты → первый вопрос делаем "визуально открытым" (без ответа)
      if (!items.some(i => i.classList.contains("faq__item--open"))) {
        items[0].classList.add("faq__item--fakeopen");
      } else {
        items.forEach(i => i.classList.remove("faq__item--fakeopen"));
      }
    });

    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        row.click();
      }
    });
  });

  // Инициализация: открываем первый вопрос
  openItem(items[0]);

  // при ресайзе пересчитать maxHeight у открытых
  window.addEventListener("resize", () => {
    items.forEach(it => {
      if (it.classList.contains("faq__item--open")) {
        const answer = it.querySelector(".faq__answer");
        if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
});
