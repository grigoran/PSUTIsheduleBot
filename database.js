import sqlite3 from "sqlite3";

let db = new sqlite3.Database("data.db");

let weekDays = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
function getWeekNumber() {
  let currentdate = new Date();
  let oneSep = new Date(currentdate.getFullYear(), 8, 1);
  let numberOfDays = Math.floor((currentdate - oneSep) / (24 * 60 * 60 * 1000));
  let result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
  return result % 2;
}

function exDbWeek(week, callback) {
  let res = "";
  db.all(
    "SELECT * FROM day NATURAl JOIN lesson WHERE week = ?",
    [week],
    (err, rows) => {
      if (err) console.log(err);
      let currentDay = "Понедельник";
      rows.forEach((row) => {
        if (row.name != currentDay) {
          res += "\n" + row.name + ":\n";
          currentDay = row.name;
        }
        res += row.subject + "\n";
      });
      callback(res);
    }
  );
}

function exDbDay(day, callback) {
  let res = day + ":\n";
  db.all(
    "SELECT * FROM day NATURAl JOIN lesson WHERE week=? AND name=?",
    [getWeekNumber(), day],
    (err, rows) => {
      if (err) console.log(err);
      rows.forEach((row) => {
        res += row.subject + "\n";
      });
      callback(res);
    }
  );
}

export let database = {
  getAll: (callback) => exDbWeek(getWeekNumber(), callback),
  getAllNext: (callback) => exDbWeek(!getWeekNumber(), callback),
  getToday: (callback) => exDbDay(weekDays[new Date().getDay()], callback),
  getTomorrow: (callback) => {
    exDbDay(weekDays[(new Date().getDay() + 1) % 7], callback);
  },
};
