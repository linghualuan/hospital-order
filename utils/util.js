const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

//定义星期
const getWeekByDate = dates => {
  let show_day = new Array(7, 1, 2, 3, 4, 5, 6);
  let date = new Date(dates);
  date.setDate(date.getDate());
  let day = date.getDay();
  return show_day[day];
}

module.exports = {
  formatTime,
  getWeekByDate: getWeekByDate
}
