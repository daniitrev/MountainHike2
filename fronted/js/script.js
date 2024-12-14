document
  .getElementById("comment-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const comment = document.getElementById("comment").value;
    const photo_url = document.getElementById("photo_url").value;

    const response = await fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        comment,
        photo_url,
      }),
    });

    const data = await response.json();

    if (data.message === "Комментарий добавлен") {
      alert("Комментарий успешно добавлен!");
      loadComments(); // Перезагрузим список комментариев
    } else {
      alert("Ошибка при добавлении комментария");
    }
  });

// Функция для загрузки комментариев
async function loadComments() {
  const response = await fetch("http://localhost:3000/comments");
  const comments = await response.json();

  const commentsContainer = document.getElementById("comments-container");
  commentsContainer.innerHTML = "";

  comments.forEach((comment) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${comment.name}</strong> (${comment.email})</p>
      <p>${comment.comment}</p>
      ${
        comment.photo_url
          ? `<img src="${comment.photo_url}" alt="Фото" width="100" />`
          : ""
      }
    `;
    commentsContainer.appendChild(div);
  });
}

// Загружаем комментарии при загрузке страницы
loadComments();
