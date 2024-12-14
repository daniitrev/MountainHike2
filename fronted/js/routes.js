async function fetchRoutes() {
  try {
    const response = await fetch("http://localhost:3000/routes"); // GET запрос на сервер
    const data = await response.json(); // Преобразуем ответ в JSON

    if (response.ok) {
      const routesList = document.getElementById("routes-list");
      routesList.innerHTML = ""; // Очищаем список перед добавлением новых данных

      // Проходим по каждому маршруту и добавляем его в HTML
      data.forEach((route) => {
        const routeCard = document.createElement("div");
        routeCard.classList.add("route-card");

        routeCard.innerHTML = `
          <img src="${route.image_url}" alt="${route.name}" class="route-image" />
        <div class="route-details">
          <a href="${route.link}" class="route-title">${route.name}</a>
          <p class="route-description">${route.description}</p>
          <div class="route-meta">
            <span>${route.distance}</span>
            <span>${route.duration}</span>
            <span class="route-difficulty ${route.difficulty}">${route.difficulty}</span>
          </div>
        </div>
      `;
        // Добавляем карточку маршрута в контейнер
        routesList.appendChild(routeCard);
      });
    } else {
      console.error("Ошибка при получении данных:", data.error);
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchRoutes);
