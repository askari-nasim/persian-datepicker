//askari.nasim92@gmail.com
let $ = document;

//Selecting elements from DOM
let calendarInput = $.querySelector(".calendar-input");
let calendarBox = $.querySelector(".calendar");
let daysWrapper = $.querySelector(".days-number");
let weekDaysWrapper = $.querySelector(".week-days");
let nameDays = $.querySelectorAll(".name-day");
let preBtn = $.querySelector(".pre-icon");
let nextBtn = $.querySelector(".next-icon");
let currentYear = $.querySelector(".current-year");
let currentYearSpan = currentYear.querySelector("span");
let currentMonth = $.querySelector(".current-month");
let currentDay = $.querySelector(".current-date");
let monthList = $.querySelector(".month-list");
let yearBox = $.querySelector(".year-wrapper");
let yearBtn = $.querySelector(".year-btn");
let yearInput = $.querySelector(".year-input");
let yearValidation = $.querySelector(".year-validation");
let monthPicker = true;
let yearPicker = true;

let today, todayData, showingMonth;

const splitStringDate = (dateString) => {
  dateString = toEnDigit(dateString);
  const dateData = dateString.split("/");
  return {
    year: dateData[0],
    month: dateData[1],
    day: dateData[2],
  };
};

//An array for storing names of persian months
const monthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
};

JalaliDate.jalaliToGregorian = function (j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no =
    365 * jy + parseInt(jy / 33) * 8 + parseInt(((jy % 33) + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy =
    1600 +
    400 *
      parseInt(
        g_day_no / 146097
      ); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) {
    /* 36525 = 365*100 + 100/4 */
    g_day_no--;
    gy +=
      100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += parseInt(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  for (
    var i = 0;
    g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
    i++
  )
    g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
};

//Get index of day in week
const getDay = (jalaliDateString) => {
  dateSplitted = jalaliDateString.split("-");
  gD = JalaliDate.jalaliToGregorian(
    dateSplitted[0],
    dateSplitted[1],
    dateSplitted[2]
  );
  gResult = gD[0] + "-" + gD[1] + "-" + gD[2];
  gDate = new Date(gResult);
  gNo = gDate.getDay();
  jNo = gNo + 1 > 6 ? gNo - 6 : gNo + 1;
  return jNo;
};

const isLeapYear = (year) => {
  return (
    year % 33 === 1 ||
    year % 33 === 5 ||
    year % 33 === 9 ||
    year % 33 === 13 ||
    year % 33 === 17 ||
    year % 33 === 22 ||
    year % 33 === 26 ||
    year % 33 === 30
  );
};

//converting English Numbers to Persian
function toFarsiNumber(n) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return n.toString().replace(/\d/g, (x) => farsiDigits[x]);
}

//converting Persian Numbers to English
function toEnDigit(s) {
  return s.replace(/[\u0660-\u0669\u06f0-\u06f9]/g, function (a) {
    return a.charCodeAt(0) & 0xf;
  });
}

//َA function that specifies the number of days in Esfand
const getEsfandDays = (year) => {
  return isLeapYear(year) ? 30 : 29;
};

//َA function that specifies the number of days in each month
const monthNumbers = (year, month) => {
  let daysOfMonths = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    getEsfandDays(year),
  ];
  return daysOfMonths[month - 1];
};

//find the previous month
const preYearMonth = () => {
  const { month, year } = showingMonth;
  let previousMonth = month - 1;
  let previousYear = year;
  if (month === 1) {
    (previousMonth = 12), (previousYear = Number(year) - 1);
  }
  showingMonth = { year: previousYear, month: previousMonth };
};

//find the next month
const NextYearMonth = () => {
  const { month, year } = showingMonth;
  let nextMonth = month + 1;
  let nextYear = year;
  if (month === 12) {
    (nextMonth = 1), (nextYear = Number(year) + 1);
  }
  showingMonth = { year: nextYear, month: nextMonth };
};

//hide month and year picker
const hidePickers = () => {
  if (!monthPicker) {
    monthList.classList.add("d-none");
    monthPicker = true;
  }
  if (!yearPicker) {
    yearBox.classList.add("d-none");
    yearPicker = true;
  }
};

//A function that creates the body of the calendar
const generateCalendar = () => {
  const { month, year } = showingMonth;
  daysWrapper.innerHTML = "";
  let firstDay = getDay(`${year}-${month}-1`);
  let lastDay = getDay(`${year}-${month}-${monthNumbers(year, month)}`);
  let numberOfDays = monthNumbers(year, month);
  let lastDaysOfPrevMonth =
    month != 1 ? monthNumbers(year, month - 1) : monthNumbers(year - 1, 12);

  let preDayCounter = 0;
  for (let j = firstDay - 1; j > -1; j--) {
    const prevDay = $.createElement("div");
    prevDay.classList.add("day", "prev", "perDig");
    prevDay.innerHTML = lastDaysOfPrevMonth - preDayCounter;
    daysWrapper.prepend(prevDay);
    preDayCounter++;
  }

  for (let i = 1; i <= numberOfDays; i++) {
    const eachDay = $.createElement("div");
    eachDay.classList.add("day", "perDig");
    eachDay.innerHTML = i;
    if (
      i === Number(todayData.day) &&
      showingMonth.month === Number(todayData.month) &&
      showingMonth.year === Number(todayData.year)
    ) {
      eachDay.classList.add("today");
    }
    if (getDay(`${year}-${month}-${i}`) === 6) {
      eachDay.classList.add("off");
    }
    daysWrapper.appendChild(eachDay);
    eachDay.onclick = () => {
      if (!monthPicker || !yearPicker) {
        hidePickers();
      } else {
        calendarInput.value = toFarsiNumber(
          `${showingMonth.year}/${showingMonth.month}/${eachDay.innerHTML}`
        );
        calendarBox.classList.add("hide");
        hidePickers();
      }
    };
  }

  for (let k = 1; k < 7 - lastDay; k++) {
    const nextDay = $.createElement("div");
    nextDay.classList.add("day", "next", "perDig");
    nextDay.innerHTML = k;
    daysWrapper.appendChild(nextDay);
  }
  let nextArray = Array.from($.querySelectorAll(".next"));
  if (nextArray.length) {
    let lastMemberArray = nextArray[nextArray.length - 1];
    lastMemberArray.classList.add("off");
  }
  convertAllDigToPer();
};

//A function for converting all English Numbers in the calendar to persian
const convertAllDigToPer = () => {
  Array.from($.querySelectorAll(".perDig")).forEach(
    (item) => (item.innerHTML = toFarsiNumber(item.innerHTML))
  );
};

const monthYearClickHandler = () => {
  currentMonth.innerHTML = monthNames[showingMonth.month - 1];
  currentYearSpan.innerHTML = toFarsiNumber(showingMonth.year);
};

const goToPreMonth = () => {
  preYearMonth();
  monthYearClickHandler();
  generateCalendar();
};

const goToNextMonth = () => {
  NextYearMonth();
  monthYearClickHandler();
  generateCalendar();
};

const showAllMonthsHandler = () => {
  if (!yearPicker) {
    yearBox.classList.add("d-none");
    yearPicker = true;
  }
  if (monthPicker) {
    monthList.classList.remove("d-none");
    monthPicker = false;
  } else {
    monthList.classList.add("d-none");
    monthPicker = true;
  }
};

const showYearBoxHandler = () => {
  if (!monthPicker) {
    monthList.classList.add("d-none");
    monthPicker = true;
  }
  if (yearPicker) {
    yearBox.classList.remove("d-none");
    yearPicker = false;
  } else {
    yearBox.classList.remove("d-none");
    yearBox.classList.add("d-none");
    yearValidation.innerHTML = "";
    yearPicker = true;
  }
};

//Validation function for year input
const showSelectedYearHandler = (event) => {
  event.preventDefault();
  const { month, year } = showingMonth;
  if (
    yearInput.value.trim() === "" ||
    !Number(yearInput.value) ||
    yearInput.value.length !== 4
  ) {
    currentYearSpan.innerHTML = toFarsiNumber(showingMonth.year);
    yearValidation.style.display = "block";
    yearInput.value = "";
    yearValidation.innerHTML = "لطفا سال را صحیح وارد کنید";
  } else {
    showingMonth = { year: yearInput.value, month: month };
    currentYearSpan.innerHTML = toFarsiNumber(showingMonth.year);
    generateCalendar();
    yearInput.value = "";
    showYearBoxHandler();
    yearValidation.innerHTML = "";
  }
};

const checkDateStringValidation = (inputValue) => {
  const rawSplitData = inputValue.split("/");

  if (rawSplitData.length !== 3) return false;

  const dateData = splitStringDate(inputValue);

  if (
    !(Number(dateData.year) && Number(dateData.month) && Number(dateData.day))
  )
    return false;

  if (Number(dateData.month) < 1 || Number(dateData.month) > 12) return false;

  if (
    Number(dateData.month) > 0 &&
    Number(dateData.month < 7) &&
    (Number(dateData.day) < 1 || Number(dateData.day) > 31)
  )
    return false;

  if (
    Number(dateData.month) > 6 &&
    Number(dateData.month < 12) &&
    (Number(dateData.day) < 1 || Number(dateData.day) > 30)
  )
    return false;

  if (
    Number(dateData.month) === 12 &&
    isLeapYear(dateData.year) &&
    Number(dateData.day) > 30
  )
    return false;

  if (
    Number(dateData.month) === 12 &&
    !isLeapYear(dateData.year) &&
    Number(dateData.day) > 29
  )
    return false;

  return true;
};

const showCalendarHandler = () => {
  let options = { year: "numeric", month: "numeric", day: "numeric" };
  today = new Date().toLocaleDateString("fa-IR", options);
  todayData = splitStringDate(today);

  if (checkDateStringValidation(calendarInput.value)) {
    const dateData = splitStringDate(calendarInput.value);
    showingMonth = {
      year: Number(dateData.year),
      month: Number(dateData.month),
    };
  } else {
    showingMonth = {
      year: Number(todayData.year),
      month: Number(todayData.month),
    };
    console.log("ibhb");
  }
  generateCalendar();
  monthYearClickHandler();
  calendarBox.classList.remove("hide");
};

const closeMonthAndYearWindow = (e) => {
  if (
    !e.target.closest(".calendar") &&
    !e.target.classList.contains("calendar-input")
  ) {
    calendarBox.classList.add("hide");
    hidePickers();
  }
};

const goToday = () => {
  showingMonth = {
    year: Number(todayData.year),
    month: Number(todayData.month),
  };
  generateCalendar();
  monthYearClickHandler();
  hidePickers();
};

monthNames.forEach((item, index) => {
  let month = $.createElement("div");
  month.innerHTML = `<div>${item}</div>`;
  monthList.append(month);
  month.onclick = () => {
    showingMonth = { year: showingMonth.year, month: index + 1 };
    currentMonth.innerHTML = item;
    generateCalendar();
    monthPicker = false;
    showAllMonthsHandler();
  };
});

preBtn.addEventListener("click", goToPreMonth);
nextBtn.addEventListener("click", goToNextMonth);
currentMonth.addEventListener("click", showAllMonthsHandler);
yearBtn.addEventListener("click", showSelectedYearHandler);
currentYear.addEventListener("click", showYearBoxHandler);
calendarInput.addEventListener("click", showCalendarHandler);
$.body.addEventListener("click", closeMonthAndYearWindow);
currentDay.addEventListener("click", goToday);
