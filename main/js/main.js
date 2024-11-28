// Select all decrement buttons, increment buttons, and number displays
const decrementBtns = document.querySelectorAll('.decrement');
const incrementBtns = document.querySelectorAll('.increment');
const numberDisplays = document.querySelectorAll('.number-display');

// Loop through all decrement buttons and attach event listeners
decrementBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let count = parseInt(numberDisplays[index].textContent);
        count = count > 0 ? count - 1 : 0;
        numberDisplays[index].textContent = count;
    });
});

// Loop through all increment buttons and attach event listeners
incrementBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        let count = parseInt(numberDisplays[index].textContent);
        count++;
        numberDisplays[index].textContent = count;
    });
});
