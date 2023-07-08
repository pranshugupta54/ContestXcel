function updateTimer(startTime, timerElementId) {
    const timerElement = document.getElementById(timerElementId);
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDiff = startTime - currentTime;

    if (timeDiff <= 0) {
      timerElement.textContent = 'Contest has started!';
    } else {
      const hours = Math.floor(timeDiff / 3600);
      const minutes = Math.floor((timeDiff % 3600) / 60);
      const seconds = timeDiff % 60;

      timerElement.textContent = `${hours}h ${minutes}m ${seconds}s remaining`;
    }
  }