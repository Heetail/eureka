
"use strict";

(() => {
  const container = document.getElementById("timer");
  if (!container) return;

  container.innerHTML = `
    <label for="timer-minutes">Minuter</label>
    <input
      id="timer-minutes"
      type="number"
      min="0"
      max="999"
      value="1"
      aria-label="Minuter"
    >

    <label for="timer-seconds">Sekunder</label>
    <input
      id="timer-seconds"
      type="number"
      min="0"
      max="59"
      value="0"
      aria-label="Sekunder"
    >

    <div
      id="timer-display"
      class="result"
      role="timer"
      aria-live="off"
      style="font-size:34px;text-align:center;font-variant-numeric:tabular-nums"
    >01:00</div>

    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">
      <button type="button" id="timer-start">▶ Starta</button>
      <button type="button" id="timer-pause" class="secondary-button">⏸ Pausa</button>
      <button type="button" id="timer-reset" class="secondary-button">↺ Återställ</button>
    </div>

    <p id="timer-status" aria-live="polite">Redo att starta!</p>
  `;

  const minutesInput = container.querySelector("#timer-minutes");
  const secondsInput = container.querySelector("#timer-seconds");
  const display = container.querySelector("#timer-display");
  const status = container.querySelector("#timer-status");
  const startButton = container.querySelector("#timer-start");
  const pauseButton = container.querySelector("#timer-pause");
  const resetButton = container.querySelector("#timer-reset");

  let remaining = 60;
  let deadline = 0;
  let intervalId = null;
  let running = false;
  let finished = false;

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return (
      String(minutes).padStart(2, "0") +
      ":" +
      String(seconds).padStart(2, "0")
    );
  }

  function updateDisplay() {
    display.textContent = formatTime(remaining);
    document.title = running
      ? `${formatTime(remaining)} | Smartverktyg`
      : "Smartverktyg | Verktyg & spel";
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function finishTimer() {
    stopInterval();
    running = false;
    finished = true;
    remaining = 0;

    updateDisplay();
    status.textContent = "⏰ Tiden är ute!";
    startButton.textContent = "▶ Starta igen";

    // En ljudsignal utan externa ljudfiler.
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass) {
        const audio = new AudioContextClass();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 880;
        gain.gain.value = 0.08;

        oscillator.connect(gain);
        gain.connect(audio.destination);

        oscillator.start();
        oscillator.stop(audio.currentTime + 0.35);
        oscillator.onended = () => audio.close();
      }
    } catch {
      // Timern fungerar även om ljud inte stöds.
    }
  }

  function tick() {
    if (!running) return;

    remaining = Math.max(
      0,
      Math.ceil((deadline - Date.now()) / 1000)
    );

    updateDisplay();

    if (remaining <= 0) {
      finishTimer();
    }
  }

  function readInputs() {
    const minutes = Number(minutesInput.value);
    const seconds = Number(secondsInput.value);

    if (
      minutesInput.value.trim() === "" ||
      secondsInput.value.trim() === "" ||
      !Number.isInteger(minutes) ||
      !Number.isInteger(seconds) ||
      minutes < 0 ||
      minutes > 999 ||
      seconds < 0 ||
      seconds > 59
    ) {
      status.textContent = "Ange giltiga minuter och sekunder.";
      return false;
    }

    const total = minutes * 60 + seconds;

    if (total < 1) {
      status.textContent = "Välj minst en sekund.";
      return false;
    }

    remaining = total;
    finished = false;
    updateDisplay();
    return true;
  }

  startButton.addEventListener("click", () => {
    if (running) return;

    if (remaining <= 0 || finished) {
      if (!readInputs()) return;
    }

    if (remaining <= 0) return;

    running = true;
    deadline = Date.now() + remaining * 1000;
    status.textContent = "Timern är igång!";
    startButton.textContent = "▶ Pågår";

    stopInterval();
    intervalId = setInterval(tick, 200);
    tick();
  });

  pauseButton.addEventListener("click", () => {
    if (!running) {
      status.textContent = "Timern är redan pausad.";
      return;
    }

    tick();

    if (!running) return;

    stopInterval();
    running = false;
    status.textContent = "Timern är pausad.";
    startButton.textContent = "▶ Fortsätt";
    updateDisplay();
  });

  resetButton.addEventListener("click", () => {
    stopInterval();
    running = false;
    finished = false;

    if (!readInputs()) {
      remaining = 0;
      updateDisplay();
      return;
    }

    status.textContent = "Timern är återställd.";
    startButton.textContent = "▶ Starta";
  });

  function inputsChanged() {
    if (running) return;

    if (readInputs()) {
      status.textContent = "Redo att starta!";
      startButton.textContent = "▶ Starta";
    }
  }

  minutesInput.addEventListener("change", inputsChanged);
  secondsInput.addEventListener("change", inputsChanged);

  updateDisplay();
})();
