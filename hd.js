const Holidays = require('date-holidays');
let hd = new Holidays("ID");

console.log(hd.isHoliday(new Date("2021-08-17 01:00:01 GMT+0800")))