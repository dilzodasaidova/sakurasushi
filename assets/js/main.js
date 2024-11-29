const incrementButtons = document.querySelectorAll(".increment");
const decrementButtons = document.querySelectorAll(".decrement");
const regionSelect = document.getElementById("region"); // Region select dropdown


const taxValue = document.getElementById("taxValue");
const taxPercentage = document.getElementById("taxPercentage");
const discountValue = document.getElementById("discountValue");
const discountPercentage = document.getElementById("discountPercentage");
const totalValue = document.getElementById("totalValue");

const BASE_CALCULATE_API_URL = "http://localhost:8080/api/order/calculate";


// Ensure the modal element exists
const orderModalElement = document.getElementById('orderModal');

// Initialize the modal
const orderModal = new bootstrap.Modal(orderModalElement, {
    backdrop: 'static', // Prevent closing by clicking outside the modal
    keyboard: false, // Disable closing with keyboard (Esc key)
});

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


// Event listener for the order button
orderButton.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission
    calculateOrder(); // Trigger order calculation
});



// Function to collect data and send to API
async function calculateOrder() {
    const selectedRegion = regionSelect.value; // Get selected region
    let products = [];

    // Collect quantities and product IDs
    document.querySelectorAll(".menu_box").forEach((menuBox, index) => {
        const quantity = parseInt(menuBox.querySelector(".number-display").textContent);
        if (quantity > 0) {
            products.push({
                productId: index + 1, // Assuming product IDs are sequential and start from 1
                quantity: quantity,
            });
        }
    });

    if (products.length === 0) {
        alert("No items selected!");
        return;
    }

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

        if (!response.ok) throw new Error("Failed to calculate order");

        const data = await response.json();
        console.log("Calculate response:", data);

        // Update modal with API response
        showOrderModal(data);
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to calculate order. Please try again.");
    }
}


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


  