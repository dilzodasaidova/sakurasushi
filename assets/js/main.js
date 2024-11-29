document.addEventListener("DOMContentLoaded", () => {
    const incrementButtons = document.querySelectorAll(".increment");
    const decrementButtons = document.querySelectorAll(".decrement");
    const orderButton = document.querySelector(".order_button"); // Order button
    const orderInfo = document.getElementById("order_info"); // Order modal
    const closeOrder = document.getElementById("closeOrder"); // Close button
    const taxElement = document.getElementById("tax"); // Tax element
    const discountElement = document.getElementById("discount"); // Discount element
    const totalElement = document.getElementById("total"); // Total element
    const regionSelect = document.getElementById("region"); // Region select dropdown
    const BASE_CALCULATE_API_URL = "http://localhost:8080/api/order/calculate";

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

    // Close the modal
    closeOrder.addEventListener("click", () => {
        orderInfo.style.display = "none";
    });

    // // Hide the modal when clicked outside or after an action
    // orderInfo.addEventListener("click", (event) => {
    //     if (event.target === orderInfo) {
    //         orderInfo.style.display = "none";
    //     }
    // });

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

            // Update modal with API response
            taxElement.textContent = `Tax (${data.taxPercentage}%): ${data.taxAmount.toLocaleString()} UZS`;
            discountElement.textContent = `Discount (${data.discountPercentage}%): ${data.discountAmount.toLocaleString()} UZS`;
            totalElement.textContent = `Total: ${data.totalAmount.toLocaleString()} UZS`;

            // Show the modal
            orderInfo.style.display = "block";
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to calculate order. Please try again.");
        }
    }

  });
  