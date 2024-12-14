// require("dotenv").config();
// const express = require("express");
// const mysql = require("mysql2");
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware для обработки JSON
// app.use(express.json());

// // Подключение к MySQL

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Ошибка подключения к базе данных:", err);
//   } else {
//     console.log("Успешное подключение к MySQL!");
//   }
// });

// // Маршрут для получения комментариев
// app.get("/comments", (req, res) => {
//   db.query("SELECT * FROM comments", (err, results) => {
//     if (err) {
//       res.status(500).json({ message: "Ошибка получения данных", error: err });
//       x;
//     } else {
//       res.json(results);
//     }
//   });
// });

// // Маршрут для добавления комментария
// app.post("/comments", (req, res) => {
//   const { name, email, comment, photo_url } = req.body;
//   const query =
//     "INSERT INTO comments (name, email, comment, photo_url) VALUES (?, ?, ?, ?)";

//   db.query(query, [name, email, comment, photo_url], (err, results) => {
//     if (err) {
//       res
//         .status(500)
//         .json({ message: "Ошибка добавления комментария", error: err });
//     } else {
//       res
//         .status(201)
//         .json({ message: "Комментарий добавлен", id: results.insertId });
//     }
//   });
// });

// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Сервер работает на http://localhost:${port}`);
// });

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   console.log("Полученные данные:", email, password);

//   const query = "SELECT * FROM users WHERE email = ? AND password = ?";
//   db.query(query, [email, password], (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: "Ошибка сервера", details: err });
//     }

//     if (results.length > 0) {
//       return res
//         .status(200)
//         .json({ message: "Успешный вход!", user: results[0] });
//     } else {
//       return res.status(401).json({ error: "Неверный email или пароль" });
//     }
//   });
// });

// app.get("/users", (req, res) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       console.error("Ошибка при запросе:", err); // Добавьте логирование ошибки
//       res.status(500).json({ message: "Ошибка получения данных", error: err });
//     } else {
//       res.json(results);
//     }
//   });
// });

require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());
// Middleware для обработки JSON
app.use(express.json());

// Подключение к базе данных
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost", // Используем переменные окружения
  user: process.env.DB_USER || "root", // Имя пользователя для подключения
  password: process.env.DB_PASSWORD || "Dtt180688", // Пароль для подключения
  database: process.env.DB_NAME || "my_database", // Имя базы данных
});

db.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err);
  } else {
    console.log("Успешное подключение к MySQL!");
  }
});

// Маршрут для получения комментариев
app.get("/comments", (req, res) => {
  db.query("SELECT * FROM comments", (err, results) => {
    if (err) {
      res.status(500).json({ message: "Ошибка получения данных", error: err });
    } else {
      res.json(results);
    }
  });
});

// Маршрут для добавления комментария
app.post("/comments", (req, res) => {
  const { name, email, comment, photo_url } = req.body;
  const query =
    "INSERT INTO comments (name, email, comment, photo_url) VALUES (?, ?, ?, ?)";

  db.query(query, [name, email, comment, photo_url], (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Ошибка добавления комментария", error: err });
    } else {
      res
        .status(201)
        .json({ message: "Комментарий добавлен", id: results.insertId });
    }
  });
});

// Обработчик маршрута логина
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Полученные данные:", email, password); // Логируем для проверки

  // Запрос к базе данных для проверки пользователя
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка сервера", details: err });
    }

    if (results.length > 0) {
      // Если найден пользователь с таким email и паролем
      return res.status(200).json({
        message: "Успешный вход!",
        user: results[0], // Возвращаем данные пользователя
      });
    } else {
      // Если пользователь не найден
      return res.status(401).json({ error: "Неверный email или пароль" });
    }
  });
});

// Маршрут для получения списка пользователей
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Ошибка при запросе:", err);
      res.status(500).json({ message: "Ошибка получения данных", error: err });
    } else {
      res.json(results);
    }
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});

app.get("/routes", (req, res) => {
  db.query("SELECT * FROM routes", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка получения данных" });
    }
    res.json(results);
  });
});

app.post("/routes", (req, res) => {
  const { name, description, difficulty, duration, distance, image_url } =
    req.body;

  const query =
    "INSERT INTO routes (name, description, difficulty, duration, distance, image_url) VALUES (?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [name, description, difficulty, duration, distance, image_url],
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Ошибка добавления маршрута", details: err });
      }
      res
        .status(201)
        .json({ message: "Маршрут добавлен", id: results.insertId });
    }
  );
});
