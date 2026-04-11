import "../styles/global.css";
import "../styles/style.css";
import "./latest.css";

function loadHTML(filename, elementId) {
  fetch(filename)
    .then((r) => r.text())
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
    });
}

loadHTML("../partials/header.html", "header-container");
loadHTML("../partials/footer.html", "footer-container");

const PAGE_SIZE = 5;

function getCurrentPage() {
  return parseInt(
    new URLSearchParams(window.location.search).get("page") || "1",
  );
}

function setPageInUrl(page) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", page);
  window.location.search = params;
}

// 🔧 Форматирование даты для отображения
function formatDisplayDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

async function loadLatest() {
  try {
    const response = await fetch("/data/news.json");
    const data = await response.json();

    // 🔥 СОРТИРУЕМ ПО ДАТЕ (новые сверху)
    const sortedNews = [...data.news].sort((a, b) => {
      return new Date(b.preview.date) - new Date(a.preview.date);
    });

    const currentPage = getCurrentPage();
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageLatest = sortedNews.slice(start, end);

    const list = document.querySelector(".news-list");
    const firstLi = list.querySelector(".news-list-item");
    list.innerHTML = "";

    pageLatest.forEach((item) => {
      const li = firstLi.cloneNode(true);

      // 🔥 Форматируем дату
      const displayDate = formatDisplayDate(item.preview.date);
      li.querySelector(".news-data").textContent = displayDate;
      li.querySelector(".news-name").textContent = item.preview.title;
      li.querySelector(".news-info").textContent = item.preview.excerpt;
      li.querySelector(
        ".button-read-more a",
      ).href = `/news/news.html?id=${item.id}`;

      // 🔥 РАБОТА С КАРТИНКОЙ
      const img = li.querySelector(".news-main-photo");
      const container = li.querySelector(".news-photo-container");

      if (item.preview.image && item.preview.image.trim() !== "") {
        // Картинка есть
        img.src = `/images/${item.preview.image.split("/").pop()}`;
        container.style.display = "block"; // или flex, смотря как у тебя
        li.classList.remove("no-image");
      } else {
        // Картинки нет — скрываем контейнер
        container.style.display = "none";
        li.classList.add("no-image");
      }

      list.appendChild(li);
    });

    setupPagination(currentPage, Math.ceil(sortedNews.length / PAGE_SIZE));
  } catch (e) {
    console.error("Ошибка:", e);
  }
}

function setupPagination(currentPage, totalPages) {
  document.querySelectorAll(".page-btn").forEach((btn) => {
    const page = Number(btn.dataset.page);
    btn.classList.toggle("active", page === currentPage);
    btn.onclick = () => setPageInUrl(page);
    btn.disabled = page > totalPages;
  });

  const prev = document.querySelector(".page-prev");
  const next = document.querySelector(".page-next");
  if (prev) {
    prev.disabled = currentPage <= 1;
    prev.onclick = () => currentPage > 1 && setPageInUrl(currentPage - 1);
  }
  if (next) {
    next.disabled = currentPage >= totalPages;
    next.onclick = () =>
      currentPage < totalPages && setPageInUrl(currentPage + 1);
  }
}

document.addEventListener("DOMContentLoaded", loadLatest);
