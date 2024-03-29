let boostButton = document.getElementById("boost");
let buttons = document.querySelectorAll(".btn");
let restButton = document.getElementById("rest");
let marathonButton = document.getElementById("marathon");
let startBtn = document.getElementById("btn-start");
let reset = document.getElementById("btn-reset");
let pause = document.getElementById("btn-pause");
let time = document.getElementById("time");
let set;
let active = "boost";
let count = 59;
let paused = true;
let minCount = 39;

time.textContent = `${minCount + 1}:00`;

const body = document.querySelector('body');

const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value;
  return value;
};

function updateTimer(minCount, count) {
  time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
}

/*SELECTED MODE---------------------*/
function updateModeTitle(title) {
  document.getElementById('mode-title').textContent = title;
}

/*SERVICE WORKER---------------------*/
function sendMessageToServiceWorker(type) {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type });
  }
}

navigator.serviceWorker.addEventListener('message', event => {
  const data = event.data;
  if (data.type === 'visibilityChange') {
    isPageVisible = data.isPageVisible;
  }
});

/*NAVIGATOR TAB TITLE---------------------*/
function updateTabTitle(minCount, count, active) {
  let modeName = '';
  switch (active) {
    case 'boost':
      modeName = 'Panda Boost';
      break;
    case 'rest':
      modeName = 'Panda Rest';
      break;
    case 'marathon':
      modeName = 'Panda Marathon';
      break;
    default:
      modeName = 'Unknown Mode';
  }
  const formattedTime = `${appendZero(minCount)}:${appendZero(count)}`;
  document.title = `${formattedTime} | ${modeName}`;
}

/*DARK MODE---------------------*/
const darkModeToggle = document.getElementById("dark-mode-toggle");
const isDarkModeEnabled = localStorage.getItem("darkModeEnabled") === "true";

darkModeToggle.checked = isDarkModeEnabled;
if (isDarkModeEnabled) {
  body.classList.add("darkmode");
}

darkModeToggle.addEventListener("change", () => {
  if (darkModeToggle.checked) {
    body.classList.add("darkmode");
    localStorage.setItem("darkModeEnabled", "true");
  } else {
    body.classList.remove("darkmode");
    localStorage.setItem("darkModeEnabled", "false");
  }
});

/*END TIMER RINGTONE---------------------*/
function playSound() {
  let audio = document.getElementById("end-sound");
  audio.play();
}

function updateCountdown() {
  if (count === 0 && minCount === 0) {
    playSound();
  }
}

navigator.serviceWorker.addEventListener("message", (event) => {
  const data = event.data;
  if (data.type === "playSound") {
    playSound();
  }
});

/*PAGE VISIBILITY API---------------------*/
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page is visible
    sendMessageToServiceWorker('pageVisible');
  } else {
    // Page is hidden
    sendMessageToServiceWorker('pageHidden');
  }
});

function handleModeSelection(activeMode, minCountValue) {
  active = activeMode;
  sendMessageToServiceWorker(`set${activeMode.charAt(0).toUpperCase() + activeMode.slice(1)}Timer`);
  updateModeTitle(`panda ${activeMode}`);
  console.log(`Active mode set to ${activeMode}`);

  removeboost();
  clearInterval(set);
  startBtn.classList.remove('hide');
  startBtn.textContent = 'Start';
  pause.classList.remove('show');
  reset.classList.remove('show');
  buttons.forEach(btn => btn.classList.remove('btn-boost'));

  minCount = minCountValue;
  count = 59;
  time.textContent = `${appendZero(minCount + 1)}:00`;
}

boostButton.addEventListener('click', () => {
  handleModeSelection('boost', 39);
});

restButton.addEventListener('click', () => {
  handleModeSelection('rest', 9);
});

marathonButton.addEventListener('click', () => {
  handleModeSelection('marathon', 89);
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page is visible
    sendMessageToServiceWorker('pageVisible');
  } else {
    // Page is hidden
    sendMessageToServiceWorker('pageHidden');
  }
});

/*MODE SELECTION---------------------*/
boostButton.addEventListener("click", () => {
  active = "boost";
  sendMessageToServiceWorker("setBoostTimer");
  updateModeTitle("panda boost");
  console.log("Active mode set to boost");

  removeboost();
  clearInterval(set);
  startBtn.classList.remove("hide");
  startBtn.textContent = "Start";
  pause.classList.remove("show");
  reset.classList.remove("show");
  boostButton.classList.add("btn-boost");
  minCount = 39;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

restButton.addEventListener("click", () => {
  active = "rest";
  sendMessageToServiceWorker("setRestTimer");
  updateModeTitle("panda rest");
  console.log("Active mode set to rest Break");

  removeboost();
  clearInterval(set);
  startBtn.classList.remove("hide");
  startBtn.textContent = "Start";
  pause.classList.remove("show");
  reset.classList.remove("show");
  restButton.classList.add("btn-boost");
  minCount = 9;
  count = 59;
  time.textContent = `${appendZero(minCount + 1)}:00`;
});

marathonButton.addEventListener("click", () => {
  active = "marathon";
  sendMessageToServiceWorker("setMarathonTimer");
  updateModeTitle("panda marathon");
  console.log("Active mode set to marathon break");

  removeboost();
  clearInterval(set);
  startBtn.classList.remove("hide");
  startBtn.textContent = "Start";
  pause.classList.remove("show");
  reset.classList.remove("show");
  marathonButton.classList.add("btn-boost");
  minCount = 89;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

/*TIMER BUTTONS---------------------*/
reset.addEventListener("click", () => {
  console.log("reset clicked");
    sendMessageToServiceWorker("reset");

    startBtn.classList.remove("hide");
    startBtn.textContent = "Start";
    pause.classList.remove("show");
    reset.classList.remove("show");
    pandaAnime.classList.remove("show-panda");
    pandaAnime.classList.add("hide-panda");
    showMode();
    showFooter();
    
    paused = true;
    clearInterval(set);
    switch (active) {
      case "marathon":
        minCount = 89;
        break;
      case "rest":
        minCount = 9;
        break;
      default:
        minCount = 39;
        break;
    }
    count = 59;
    time.textContent = `${appendZero(minCount + 1)}:00`;
  });
  

const removeboost = () => {
  buttons.forEach((btn) => {
    btn.classList.remove("btn-boost");
  });
  
};

pause.addEventListener("click", () => {
  if (!paused) {
    sendMessageToServiceWorker("pause");
    clearInterval(set);
    paused = true;
    startBtn.classList.remove("hide");
    startBtn.textContent = "Continue";
    pause.classList.remove("show");
    pandaAnime.classList.remove("show-panda");
    pandaAnime.classList.add("hide-panda");
    showMode();
    showFooter();
  }
});

startBtn.addEventListener("click", () => {
  sendMessageToServiceWorker("start");

  reset.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");
  hideMode();
  hideFooter();
  showPandaAnime();

  paused = false;

  console.log("Starting the timer. paused = " + paused);

  updateTimer(minCount, count);

  set = setInterval(() => {
    count--;
    time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
    updateTabTitle(minCount, count, active);
    if (count === 0) {
      if (minCount !== 0) {
        minCount--;
        count = 60;
      } else {
        clearInterval(set);
        playSound();

        switch (active) {
          case "boost":
            minCount = 39;
            break;
          case "rest":
            minCount = 9;
            break;
          case "marathon":
            minCount = 89;
            break;
          default:
            minCount = 39; 
        }
        count = 59;
        time.textContent = `${appendZero(minCount + 1)}:00`;

        reset.classList.remove("show");
        pause.classList.remove("show");
        startBtn.classList.remove("hide");
        startBtn.textContent = "Start";
        pandaAnime.classList.remove("show-panda");
        pandaAnime.classList.add("hide-panda");
        showMode();
        showFooter();
      }
    }
    updateCountdown();
  }, 1000);
});

navigator.serviceWorker.addEventListener("message", (event) => {
  const data = event.data;
  if (data.type === "updateTimer") {
    updateTimer(data.minCount, data.count);
  }
});

/*LOAD SCREEN---------------------*/
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  setTimeout(() => {
    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () => {
      if (document.body.contains(loader)) {
        document.body.removeChild(loader);
      }
    });
  }, 1000);
});

/*SETTINGS---------------------*/
let settingsButton = document.getElementById("settings");
let settingsBox = document.getElementById("settings-box");
let settingScreen = document.getElementById("setting-screen");

function toggleSettings() {
  settingsBox.classList.toggle("open-settings");
  if (settingsBox.classList.contains("open-settings")) {
    settingsBox.style.animationPlayState = "running"; 
  } else {
    settingsBox.style.animationPlayState = "paused"; 
  }
}

settingsButton.addEventListener("click", toggleSettings);

function closeSettings() {
  settingsBox.classList.remove("open-settings");
  settingsBox.style.animationPlayState = "paused"; 
}

function toggleSettings() {
    settingsBox.classList.toggle("open-settings");
    settingScreen.style.display = settingsBox.classList.contains("open-settings") ? "block" : "none";
}

settingsButton.addEventListener("click", toggleSettings);

function closeSettings() {
  document.getElementById("setting-screen").style.display = "none";
}

settingScreen.addEventListener("click", function(event) {
    if (event.target === settingScreen) {
        toggleSettings();
    }
});

/*INFO---------------------*/
let infoButton = document.getElementById("info");
let infoBox = document.getElementById("info-container");
let infoScreen = document.getElementById("info-screen");

function toggleInfo() {
  infoBox.classList.toggle("open-info");
}

infoButton.addEventListener("click", toggleInfo);

function closeInfo() {
  infoBox.classList.remove("open-info");
}

function toggleInfo() {
    infoBox.classList.toggle("open-info");
    infoScreen.style.display = infoBox.classList.contains("open-info") ? "block" : "none";
}

infoButton.addEventListener("click", toggleInfo);

function closeInfo() {
  document.getElementById("info-screen").style.display = "none";
}

infoScreen.addEventListener("click", function(event) {
    if (event.target === infoScreen) {
        toggleInfo();
    }
});

/*PANDA ANIMATION---------------------*/
const pandaAnime = document.querySelector(".panda-anime");
const toggleSwitch = document.getElementById("animation-toggle");

if (localStorage.getItem("animationToggleState") === null) {
  localStorage.setItem("animationToggleState", "on");
}

function togglePandaAnimation() {
  if (toggleSwitch.checked) {
    
    localStorage.setItem("animationToggleState", "on");
  } else {
    
    localStorage.setItem("animationToggleState", "off");
  }
}

const savedToggleState = localStorage.getItem("animationToggleState");
if (savedToggleState === "on") {
  toggleSwitch.checked = true;
  showPandaAnime();
} else {
  toggleSwitch.checked = false;
}

toggleSwitch.addEventListener("change", togglePandaAnimation);

function showPandaAnime() {
  if (!toggleSwitch.checked) {
    return;
  }
  pandaAnime.classList.add("show-panda");
  pandaAnime.classList.remove("hide-panda");
}

pandaAnime.classList.add("hide-panda");


/*MODE SELECTION MENU---------------------*/
function showMode() {
  var modeSelection = document.getElementById("mode-selection");
  modeSelection.style.display = "block";
  setTimeout(function() {
    modeSelection.classList.remove("hide-mode");
    modeSelection.classList.add("show-mode");
  }, 0); 
}

function hideMode() {
  var modeSelection = document.getElementById("mode-selection");
  modeSelection.classList.remove("show-mode");
  modeSelection.classList.add("hide-mode");
  
  setTimeout(function() {
    modeSelection.style.display = "none";
  }, 500); 
}

/*FOOTER MENU---------------------*/
function showFooter() {
  var footer = document.getElementById("footer");
  footer.style.visibility = "visible"; 
  setTimeout(function() {
    footer.classList.remove("hide-footer");
    footer.classList.add("show-footer");
  }, 0);
}

function hideFooter() {
  var footer = document.getElementById("footer");
  footer.classList.remove("show-footer");
  footer.classList.add("hide-footer");
  setTimeout(function() {
    footer.style.visibility = "hidden"; 
  }, 500);
}
