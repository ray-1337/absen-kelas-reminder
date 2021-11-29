const wa = require('@open-wa/wa-automate');
const {stripIndents} = require("common-tags");
const schedule = require('node-schedule');
const Holidays = require('date-holidays');
const hd = new Holidays("ID");
const config = require("./website.config.js");
require("dotenv").config();

wa.create({
  sessionId: "RAY_272002",
  authTimeout: 60,
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  cacheEnabled: false,
  hostNotificationLang: 'ID_ID',
  logConsole: false,
  popup: true,
  qrTimeout: 60,
  multiDevice: false
})
.then(async client => {
  let grupKelasPublic = process.env["GCWITHGURU"];

  // jam masuk
  schedule.scheduleJob({tz: 'Asia/Kuala_Lumpur', hour: 06, minute: 00, dayOfWeek: [new schedule.Range(1, 6)]}, function() {
    // libur
    let libur = hd.isHoliday(new Date(new Date().setUTCHours(9)));
    if (libur && libur instanceof Array) {
      return;

      // UNFINISHED
      client.sendText(grupKelasPublic, stripIndents`
      Selamat pagi!
      Hari ini libur atau tidak ya?
      ${libur[0]?.name ? `Hari ini adalah hari *${libur[0].name}*` : " "}

      Saya tidak tahu!
      Karena saya hanyalah robot dan cuman bisa prediksi, sangat disarankan untuk bertanya ke guru kalian masing-masing!

      Have a good day!

      ${config.absenURL}
      ${config.belajarURL}
      `);
    };
    
    return client.sendText(grupKelasPublic, stripIndents`
      Selamat pagi!
      Jangan lupa *absen kelas/mata pelajaran ya!*
      Have a good day!

      ${config.absenURL}
      ${config.belajarURL}
      `);
  });

  // jam pulang
  schedule.scheduleJob({tz: 'Asia/Kuala_Lumpur', hour: 13, minute: 00, dayOfWeek: [new schedule.Range(1, 6)]}, function() {
    // libur
    let libur = hd.isHoliday(new Date(new Date().setUTCHours(9)));
    if (libur && libur instanceof Array) return;

    return client.sendText(grupKelasPublic, stripIndents`
    Selamat siang semuanya!
    Jangan lupa *absen pulangnya* ya!
    Kalo ada tugas, jangan lupa dikerjain!
    Have a good day!

    ${config.absenURL}
    ${config.belajarURL}
    `);
  });

  client.onMessage(async message => {
    switch (true) {
      case !!(message.body === "ping" && message.from === process.env["TEST"]):
        return client.sendText(message.from, `working: ${message.t}`);

      default: return;
    };
  });
});
