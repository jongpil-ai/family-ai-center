
const monthTitle = document.getElementById("monthTitle");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDateTitle = document.getElementById("selectedDateTitle");
const scheduleList = document.getElementById("scheduleList");

let currentDate = new Date();
let selectedDate = new Date();

const storageKey = "familySchedules";
let schedules = [];

try {
  schedules = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!Array.isArray(schedules)) schedules = [];
} catch {
  schedules = [];
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  monthTitle.textContent = `${year}년 ${month + 1}월`;
  calendarGrid.innerHTML = "";

  ["일", "월", "화", "수", "목", "금", "토"].forEach(day => {
    const cell = document.createElement("div");
    cell.className = "weekday";
    cell.textContent = day;
    calendarGrid.appendChild(cell);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    calendarGrid.appendChild(blank);
  }

  for (let day = 1; day <= lastDay; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(date);

    
const button = document.createElement("button");
button.className = "calendar-day";

const dayNumber = document.createElement("span");
dayNumber.className = "day-number";
dayNumber.textContent = day;
button.appendChild(dayNumber);

// 가족별 일정 색상
const personColors = {
  "아빠": "#dceaff",
  "엄마": "#ffe0ee",
  "로하": "#dcf5e4",
  "코코": "#eee0ff",
  "가족 공통": "#ffdede"
};

// 해당 날짜에 등록된 일정 찾기
const daySchedules = schedules.filter(item => item.date === key);

// 날짜 칸 안에 일정 제목 표시
daySchedules.forEach(item => {
  const label = document.createElement("span");
  label.className = "schedule-label";
  label.textContent = `${item.person} · ${item.content}`;
  label.style.backgroundColor = personColors[item.person] || "#eeeeee";

  button.appendChild(label);
});

    if (key === dateKey(new Date())) {
      button.classList.add("today");
    }

    if (key === dateKey(selectedDate)) {
      button.classList.add("selected");
    }

    if (schedules.some(item => item.date === key)) {
      button.classList.add("has-schedule");
    }

    button.addEventListener("click", () => {
      selectedDate = date;
      renderCalendar();
      renderSchedules();
    });

    calendarGrid.appendChild(button);
  }
}

function renderSchedules() {
  const key = dateKey(selectedDate);
  selectedDateTitle.textContent = `${key} 일정`;
  scheduleList.innerHTML = "";

  const dailySchedules = schedules.filter(item => item.date === key);

  if (dailySchedules.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "등록된 일정이 없습니다.";
    scheduleList.appendChild(empty);
    return;
  }

  dailySchedules.forEach(item => {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = `${item.person} · ${item.content}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제";

    deleteButton.addEventListener("click", () => {
      schedules = schedules.filter(schedule => schedule.id !== item.id);
      saveSchedules();
      renderCalendar();
      renderSchedules();
    });

    li.appendChild(label);
    li.appendChild(deleteButton);
    scheduleList.appendChild(li);
  });
}

function saveSchedules() {
  localStorage.setItem(storageKey, JSON.stringify(schedules));
}

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  renderCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );
  renderCalendar();
});

document.getElementById("addSchedule").addEventListener("click", () => {
  const person = document.getElementById("schedulePerson").value;
  const input = document.getElementById("scheduleInput");
  const content = input.value.trim();

  if (!content) {
    alert("일정 내용을 입력해주세요.");
    return;
  }

  schedules.push({
    id: crypto.randomUUID(),
    date: dateKey(selectedDate),
    person: person,
    content: content
  });

  saveSchedules();
  renderCalendar();
  renderSchedules();
  input.value = "";
});

renderCalendar();
renderSchedules();
