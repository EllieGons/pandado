let focusButton = document.getElementById("focus");
let buttons = document.querySelectorAll(".btn");
let shortBreakButton = document.getElementById("shortbreak");
let longBreakButton = document.getElementById("longbreak");
let startBtn = document.getElementById("btn-start");
let reset = document.getElementById("btn-reset");
let pause = document.getElementById("btn-pause");
let time = document.getElementById("time");
let set;
let active = "focus";
let count = 59;
let paused = true;
let minCount = 24;
time.textContent = `${minCount + 1}:00`;

const body = document.querySelector('body');
const btn = document.querySelector('.mode-switcher');
const icon = document.querySelector('.lightmode-icon');

const taskInput = document.getElementById('task');

const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value;
  return value;
};

/*Dark mode*/
const savedMode = localStorage.getItem('mode');
const savedTask = localStorage.getItem('task');
if (savedMode === 'darkmode') {
  body.classList.add('darkmode');
  icon.classList.remove('lightmode-icon');
  icon.textContent = 'dark_mode';
}

btn.addEventListener('click', () => {
  body.classList.toggle('darkmode');
  icon.classList.toggle('lightmode-icon');
  icon.textContent = body.classList.contains('darkmode') ? 'dark_mode' : 'light_mode';

  const currentMode = body.classList.contains('darkmode') ? 'darkmode' : 'lightmode';
  localStorage.setItem('mode', currentMode);

  localStorage.setItem('task', taskInput.value);
});

/*Target task storage*/
if (savedTask) {
  taskInput.value = savedTask;
}

taskInput.addEventListener('input', () => {
  localStorage.setItem('task', taskInput.value);
});

/*Alarm*/
function playSound() {
  let audio = document.getElementById("end-sound");
  audio.play();
}

function updateCountdown() {
  if (count === 0 && minCount === 0) {
    playSound();
  }
}

/*Timer*/
reset.addEventListener(
  "click",
  (resetTime = () => {
    pauseTimer();
    switch (active) {
      case "long":
        minCount = 29;
        break;
      case "short":
        minCount = 4;
        break;
      default:
        minCount = 24;
        break;
    }
    count = 59;
    time.textContent = `${appendZero(minCount + 1)}:00`;
  })
);

const removeFocus = () => {
  buttons.forEach((btn) => {
    btn.classList.remove("btn-focus");
  });
};

focusButton.addEventListener("click", () => {
  active = "focus";
  removeFocus();
  focusButton.classList.add("btn-focus");
  pauseTimer();
  minCount = 24;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

shortBreakButton.addEventListener("click", () => {
  active = "short";
  removeFocus();
  shortBreakButton.classList.add("btn-focus");
  pauseTimer();
  minCount = 4;
  count = 59;
  time.textContent = `${appendZero(minCount + 1)}:00`;
});

longBreakButton.addEventListener("click", () => {
  active = "long";
  removeFocus();
  longBreakButton.classList.add("btn-focus");
  pauseTimer();
  minCount = 29;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

pause.addEventListener(
  "click",
  (pauseTimer = () => {
    paused = true;
    clearInterval(set);
    startBtn.classList.remove("hide");
    pause.classList.remove("show");
    reset.classList.remove("show");
  })
);

startBtn.addEventListener("click", () => {
  reset.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");
  if (paused) {
    paused = false;
    time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
    set = setInterval(() => {
      count--;
      time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
      if (count == 0) {
        if (minCount != 0) {
          minCount--;
          count = 60;
        } else {
          clearInterval(set);
        }
      }
      updateCountdown();
    }, 1000);
  }
});


