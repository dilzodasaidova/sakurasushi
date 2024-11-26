    // JavaScript to add functionality
    const decrementBtn = document.getElementById('decrement');
    const incrementBtn = document.getElementById('increment');
    const numberDisplay = document.getElementById('number');

    let count = 0;

    decrementBtn.addEventListener('click', () => {
      count--;
      numberDisplay.textContent = count;
    });

    incrementBtn.addEventListener('click', () => {
      count++;
      numberDisplay.textContent = count;
    });