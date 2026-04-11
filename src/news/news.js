import "../styles/global.css";
import "../styles/style.css";
import "./news.css";

function loadHTML(filename, elementId) {
  fetch(filename)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    })
    .catch((error) => console.error("Ошибка загрузки HTML:", error));
}

loadHTML("../partials/header.html", "header-container");
loadHTML("../partials/footer.html", "footer-container");

async function loadFullNews() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get("id") || "1";
    const response = await fetch("/data/news.json");
    const data = await response.json();
    const article = data.news.find((item) => item.id === articleId);

    if (!article) {
      console.error("Статья не найдена");
      return;
    }

    document.querySelector(".new-name").textContent = article.full.title;
    document.querySelector(".new-name-data").textContent = article.full.date;
    document.querySelector(".new-text-begin").textContent = article.full.intro;
    document.querySelector(".new-text-main").innerHTML = article.full.content;

    // 🔥 РАБОТА С КАРТИНКОЙ
    const img = document.querySelector(".new-photo-change");

    if (article.full.image && article.full.image.trim() !== "") {
      // Картинка есть — показываем
      const imageName = article.full.image.split("/").pop();
      img.src = `/images/${imageName}`;
      img.style.display = "block"; // или inline-block, смотря как у тебя
    } else {
      // Картинки нет — скрываем элемент
      img.style.display = "none";
      // Добавляем класс к контейнеру для растягивания текста
      document.querySelector(".new-container").classList.add("no-image");
    }
  } catch (error) {
    console.error("Ошибка загрузки статьи:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFullNews();
});
