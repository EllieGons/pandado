let count = 59;
let minCount = 39;
let active = "focus";
let paused = true;
let set;
let isPageVisible = true;

function updateTimer() {
  if (!paused) {
    if (count === 0) {
      if (minCount > 0) {
        minCount--;
        count = 59;
      } else {
        clearInterval(set);
        playSound();

        switch (active) {
          case "focus":
            minCount = 39;
            break;
          case "short":
            minCount = 9;
            break;
          case "long":
            minCount = 89;
            break;
          default:
            minCount = 39;
            break;
        }
        count = 59;

        time.textContent = `${appendZero(minCount + 1)}:00`;

        reset.classList.remove("show");
        pause.classList.remove("show");
        startBtn.classList.remove("hide");
        startBtn.textContent = "Start";
      }
    }

    time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
    count--;

    self.clients.matchAll().then(function (clients) {
      clients.forEach(function (client) {
        client.postMessage({ type: "updateTimer", minCount, count });
      });
    });
  }
}

function startTimer() {
  set = setInterval(updateTimer, 1000);
}

self.addEventListener("message", function (event) {
  const data = event.data;

  switch (data.type) {
    case "setFocusTimer":
      minCount = 39;
      count = 59;
      paused = true;
      break;
    case "setShortBreak":
      minCount = 9;
      count = 59;
      paused = true;
      break;
    case "setLongBreak":
      minCount = 89;
      count = 59;
      paused = true;
      break;
    case "start":
      paused = false;
      startTimer();
      break;
    case "pause":
      paused = true;
      clearInterval(set);
      break;
    case "reset":
      paused = true;
      clearInterval(set);
      switch (active) {
        case "focus":
          minCount = 39;
          break;
        case "short":
          minCount = 9;
          break;
        case "long":
          minCount = 89;
          break;
        default:
          minCount = 39;
          break;
      }
      count = 59;
      break;
    case "requestUpdate":
      self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({ type: "updateTimer", minCount, count });
        });
      });
      break;
    case "playSound":
      self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
          client.postMessage({ type: "playSound" });
        });
      });
      break;
  }
});

self.addEventListener('visibilitychange', () => {
  isPageVisible = !document.hidden;
  if (isPageVisible) {
    startTimer();
  } else {
    clearInterval(set);
  }
});

if (isPageVisible) {
  startTimer();
}
