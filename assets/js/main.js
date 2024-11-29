/* --------------------------------- VARIABLES ------------------------------------------ */
const incrementButtons = document.querySelectorAll(".increment");
const decrementButtons = document.querySelectorAll(".decrement");
const regionSelect = document.getElementById("region");
const dateChosen = document.getElementById("date");


const taxValue = document.getElementById("taxValue");
const taxPercentage = document.getElementById("taxPercentage");
const discountValue = document.getElementById("discountValue");
const discountPercentage = document.getElementById("discountPercentage");
const totalValue = document.getElementById("totalValue");
const placeOrderButton = document.getElementById("submitOrder");

const BASE_CALCULATE_API_URL = "http://localhost:8080/api/order/calculate";
const BASE_PLACE_ORDER_API_URL = "http://localhost:8080/api/order";

/* ---------------------------------- MODALS INIT ----------------------------------------- */
// Ensure the modal element exists
const orderModalElement = document.getElementById('orderModal');

// Initialize the modal
const orderModal = new bootstrap.Modal(orderModalElement, {
    backdrop: 'static', // Prevent closing by clicking outside the modal
    keyboard: false, // Disable closing with keyboard (Esc key)
});


/* ---------------------------------------INCREMENT & DECREMENT BUTTONS--------------------------------------- */
// Add event listeners to increment buttons
incrementButtons.forEach(button => {
    button.addEventListener("click", () => {
        const quantityDisplay = button.previousElementSibling;
        const currentValue = parseInt(quantityDisplay.textContent);
        quantityDisplay.textContent = currentValue + 1;
    });
});

// Add event listeners to decrement buttons
decrementButtons.forEach(button => {
    button.addEventListener("click", () => {
        const quantityDisplay = button.nextElementSibling;
        const currentValue = parseInt(quantityDisplay.textContent);
        if (currentValue > 0) {
            quantityDisplay.textContent = currentValue - 1;
        }
    });
});

/* ---------------------------------------CALCULATE BUTTON--------------------------------------- */
// Event listener for the order button
orderButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    calculateOrder(); // Trigger order calculation
});

/* ---------------------------------------CALCULATE API --------------------------------------- */
// Function to collect data and send to API
async function calculateOrder() {
    // Validate first
    const errors = validateInputs();
    if (errors.length > 0) {
        showValidationErrors(errors);
        return;
    }

    const selectedRegion = regionSelect.value;
    const products = collectProducts();

    // Construct the request payload
    const payload = {
        region: selectedRegion,
        products: products,
    };

    try {
        // Send data to the API
        const response = await fetch(BASE_CALCULATE_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        console.log("Sending data to calculate API", response.body);

        if (!response.ok) throw new Error("Failed to calculate order");

        const data = await response.json();
        console.log("Calculate response:", data);

        // Update modal with API response
        showOrderModal(data);
    } catch (error) {
        console.error("Error:", error);
        showErrorPopup("Failed to calculate order. Please try again.");
    }
}

/* ---------------------------------------PLACE ORDER BUTTON--------------------------------------- */
// Event listener for the place order button
placeOrderButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    placeOrder(); // Trigger placing order api
});

/* ---------------------------------------PLACE ORDER API --------------------------------------- */
async function placeOrder() {
    const selectedRegion = regionSelect.value;
    const selectedDate = dateChosen.value;
    const products = collectProducts();


    const payload = {
        date: selectedDate,
        region: selectedRegion,
        products: products,
    };

    try {
        const response = await fetch(BASE_PLACE_ORDER_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        console.log("Sending data to place order API", response.body);

        if (!response.ok) throw new Error("Failed to place order");


        const data = await response.text();
        console.log("Place order response:", data);
        resetForm();
        showSuccessPopup("Order placed successfully!");

    } catch (error) {
        console.error("Error:", error);
        // Show error toast
        showErrorPopup("Failed to place order. Please try again.");
    }
}

/* ---------------------------------------VALIDATE SELECTION HELPER --------------------------------------- */

function validateInputs() {
    const selectedRegion = regionSelect.value;
    const selectedDate = dateChosen.value;
    const products = collectProducts();

    const errors = [];

    // Check if region is selected
    if (!selectedRegion) {
        errors.push("Please select a region.");
    }

    // Check if date is selected
    if (!selectedDate) {
        errors.push("Please select a delivery date.");
    } else {
        const currentDate = new Date();
        const chosenDate = new Date(selectedDate);
        if (chosenDate < currentDate) {
            errors.push("The delivery date cannot be in the past.");
        }

        const years = 50;
        const futureDate = currentDate.setFullYear(currentDate.getFullYear() + years);
        if (chosenDate > futureDate) {
            errors.push("The delivery date cannot be 50 years into future.");
        }

    }

    // Check if any products are added
    if (products.length === 0) {
        errors.push("Please add at least one product to your order.");
    }

    return errors;
}

/* ---------------------------------------COLLECT PRODUCTS HELPER --------------------------------------- */
// Collect products
function collectProducts() {
    let products = [];
    document.querySelectorAll(".menu_box").forEach((menuBox, index) => {
        const quantity = parseInt(menuBox.querySelector(".number-display").textContent);
        if (quantity > 0) {
            products.push({
                productId: index + 1, // Assuming product IDs are sequential and start from 1
                quantity: quantity,
            });
        }
    });
    return products;
}

/* ---------------------------------------SHOW MODAL WINDOW HELPER --------------------------------------- */
// Show the Bootstrap modal with the order summary
function showOrderModal(data) {
    console.log("Modal Data:", data);
    taxPercentage.textContent = data.taxPercentage || 0;
    taxValue.textContent = data.taxAmount.toLocaleString() || 0;
    discountPercentage.textContent = data.discountPercentage || 0;
    discountValue.textContent = data.discountAmount.toLocaleString() || 0;
    totalValue.textContent = data.totalAmount.toLocaleString() || 0;

    // Show the modal
    console.log("Showing modal...");
    orderModal.show();
}

/* ---------------------------------------SHOW TOAST HELPER --------------------------------------- */
function showToast(message, type = "primary", timeout = 3000) {
    // Get the toast element and message container
    const toastElement = document.getElementById("customToast");
    const toastMessage = document.getElementById("toastMessage");

    // Update the message and type
    toastMessage.textContent = message;
    toastElement.className = `toast align-items-center text-white bg-${type} border-0`;

    // Initialize and show the toast
    const toast = new bootstrap.Toast(toastElement, { delay: timeout });
    toast.show();
}

function showSuccessPopup(message) {
    showToast(message || "Operation completed successfully!", "success");
}

function showErrorPopup(message) {
    showToast(message || "An error occurred. Please try again.", "danger");
}

function showValidationErrors(errors) {
    const errorMessage = errors.join("\n"); // Combine errors into a single string
    showToast(errorMessage, "warning");
}


/* ---------------------------------------RESET VALUES HELPER --------------------------------------- */
function resetForm() {
    // Reset product quantities
    document.querySelectorAll(".number-display").forEach((quantityDisplay) => {
        quantityDisplay.textContent = "0";
    });

    // Reset region dropdown
    regionSelect.value = regionSelect.options[0].value; // Reset to the first option

    // Reset date input
    dateChosen.value = "";

    // Reset modal values
    taxPercentage.textContent = "0";
    taxValue.textContent = "0";
    discountPercentage.textContent = "0";
    discountValue.textContent = "0";
    totalValue.textContent = "0";

    // Hide the modal (if it's still open)
    orderModal.hide();
}

  