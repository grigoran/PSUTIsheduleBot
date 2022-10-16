import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./token.js";
import { Markup } from "telegraf";

import { database } from "./database.js";

const bot = new Telegraf(BOT_TOKEN);

const startKeyboard = Markup.inlineKeyboard(
  [
    Markup.button.callback("Сегодня", "today"),
    Markup.button.callback("Завтра", "tomorrow"),
    Markup.button.callback("Вся неделя", "all"),
    Markup.button.callback("Следующая неделя", "allNext"),
  ],
  { columns: 2 }
);

bot.action("today", (ctx) => {
  database.getToday((res) => {
    ctx.reply(res, startKeyboard);
  });
});
bot.action("tomorrow", (ctx) => {
  database.getTomorrow((res) => {
    ctx.reply(res, startKeyboard);
  });
});
bot.action("all", (ctx) => {
  database.getAll((res) => {
    ctx.reply(res, startKeyboard);
  });
});
bot.action("allNext", (ctx) => {
  database.getAllNext((res) => {
    ctx.reply(res, startKeyboard);
  });
});

bot.start((ctx) => {
  ctx.reply("Выбери день", startKeyboard);
});

bot.help((ctx) => ctx.sendMessage("Выбери день", startKeyboard));

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
