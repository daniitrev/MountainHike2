const { Telegraf, Markup } = require("telegraf");
const routes = require("../routes.json");

const bot = new Telegraf("7571523149:AAEtNlVYHS2lgq9r5uju1LzLfv975e-zpJk"); // Замените на ваш токен

// Локализация
const messages = {
  en: {
    start: "Welcome! Choose your language:",
    age: "Please select your age group:",
    fitness: "Select your fitness level:",
    length: "Preferred route length (km):",
    season: "Choose the season:",
    type: "Select the route type:",
    result: "Here is a suitable route for you:",
    languages: { ru: "Русский", en: "English", kz: "Қазақша" },
  },
  ru: {
    start: "Добро пожаловать! Выберите язык:",
    age: "Выберите вашу возрастную группу:",
    fitness: "Выберите уровень физической подготовки:",
    length: "Предпочтительная длина маршрута (км):",
    season: "Выберите сезон:",
    type: "Выберите тип маршрута:",
    result: "Вот подходящий маршрут для вас:",
    languages: { ru: "Русский", en: "English", kz: "Қазақша" },
  },
  kz: {
    start: "Қош келдіңіз! Тілді таңдаңыз:",
    age: "Жасыңыздың санатын таңдаңыз:",
    fitness: "Дайындық деңгейін таңдаңыз:",
    length: "Маршрут ұзындығы (км):",
    season: "Мезгілді таңдаңыз:",
    type: "Маршруттың түрін таңдаңыз:",
    result: "Сізге қолайлы маршрут:",
    languages: { ru: "Русский", en: "English", kz: "Қазақша" },
  },
};

// Инициализация состояния пользователя
const userState = {};

// Стартовая команда
bot.start((ctx) => {
  userState[ctx.chat.id] = { lang: "en" }; // По умолчанию английский
  ctx.reply(
    messages.en.start,
    Markup.inlineKeyboard([
      [Markup.button.callback("English", "lang_en")],
      [Markup.button.callback("Русский", "lang_ru")],
      [Markup.button.callback("Қазақша", "lang_kz")],
    ])
  );
});

// Обработка выбора языка
bot.action(/lang_(.+)/, (ctx) => {
  try {
    const lang = ctx.match[1];
    userState[ctx.chat.id].lang = lang;
    ctx.reply(
      messages[lang].age,
      Markup.inlineKeyboard([
        [Markup.button.callback("18-25", "age_18-25")],
        [Markup.button.callback("26-40", "age_26-40")],
        [Markup.button.callback("40+", "age_40+")],
      ])
    );
  } catch (error) {
    console.error("Error in lang selection:", error);
  }
});

// Обработка выбора возраста
bot.action(/age_(.+)/, (ctx) => {
  try {
    userState[ctx.chat.id].age = ctx.match[1];
    const lang = userState[ctx.chat.id].lang;
    ctx.reply(
      messages[lang].fitness,
      Markup.inlineKeyboard([
        [Markup.button.callback("Beginner", "fitness_beginner")],
        [Markup.button.callback("Intermediate", "fitness_intermediate")],
        [Markup.button.callback("Advanced", "fitness_advanced")],
      ])
    );
  } catch (error) {
    console.error("Error in age selection:", error);
  }
});

// Обработка уровня подготовки
bot.action(/fitness_(.+)/, (ctx) => {
  try {
    userState[ctx.chat.id].fitness = ctx.match[1];
    const lang = userState[ctx.chat.id].lang;
    ctx.reply(
      messages[lang].length,
      Markup.inlineKeyboard([
        [Markup.button.callback("5-10 km", "length_5-10")],
        [Markup.button.callback("10-20 km", "length_10-20")],
        [Markup.button.callback("20+ km", "length_20+")],
      ])
    );
  } catch (error) {
    console.error("Error in fitness selection:", error);
  }
});

// Обработка длины маршрута
bot.action(/length_(.+)/, (ctx) => {
  try {
    userState[ctx.chat.id].length = ctx.match[1];
    const lang = userState[ctx.chat.id].lang;
    ctx.reply(
      messages[lang].season,
      Markup.inlineKeyboard([
        [Markup.button.callback("Winter", "season_winter")],
        [Markup.button.callback("Spring", "season_spring")],
        [Markup.button.callback("Summer", "season_summer")],
        [Markup.button.callback("Autumn", "season_autumn")],
      ])
    );
  } catch (error) {
    console.error("Error in length selection:", error);
  }
});

// Обработка сезона
bot.action(/season_(.+)/, (ctx) => {
  try {
    userState[ctx.chat.id].season = ctx.match[1];
    const lang = userState[ctx.chat.id].lang;
    ctx.reply(
      messages[lang].type,
      Markup.inlineKeyboard([
        [Markup.button.callback("Walking", "type_walking")],
        [Markup.button.callback("Trekking", "type_trekking")],
        [Markup.button.callback("Challenging", "type_challenging")],
      ])
    );
  } catch (error) {
    console.error("Error in season selection:", error);
  }
});

// Обработка типа маршрута
bot.action(/type_(.+)/, (ctx) => {
  try {
    const type = ctx.match[1];
    const lang = userState[ctx.chat.id].lang;

    // Фильтрация маршрутов
    const filteredRoutes = routes.filter((route) => route.type === type);

    if (filteredRoutes.length > 0) {
      // Отправка первого подходящего маршрута
      const route = filteredRoutes[0];
      ctx.reply(
        `${messages[lang].result}\n\n` +
          `📍 ${route.name}\n` +
          `📏 ${route.length}\n` +
          `🗓️ ${route.season}\n\n` +
          `[Подробнее на сайте](${route.link})`,
        { parse_mode: "Markdown" }
      );
    } else {
      ctx.reply("К сожалению, маршруты не найдены.");
    }
  } catch (error) {
    console.error("Error in type selection:", error);
  }
});

// Запуск бота
bot.launch();

console.log("Бот запущен!");
