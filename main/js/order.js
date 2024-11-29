<script>
// Get references to the button and the success message
const confirmOrderButton = document.getElementById('confirmOrderButton');
const successMessage = document.getElementById('successMessage');

// Add a click event listener to the button
confirmOrderButton.addEventListener('click', function () {
    // Show the success message
    successMessage.style.display = 'block';
});
</script>