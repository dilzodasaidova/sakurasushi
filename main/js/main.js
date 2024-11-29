document.addEventListener("DOMContentLoaded", () => {
    const incrementButtons = document.querySelectorAll(".increment");
    const decrementButtons = document.querySelectorAll(".decrement");
    const orderButton = document.querySelector(".order_button"); // Order button
    const orderInfo = document.getElementById("order_info"); // Order modal
    const taxElement = document.getElementById("tax"); // Tax element
    const discountElement = document.getElementById("discount"); // Discount element
    const totalElement = document.getElementById("total"); // Total element
    const taxRate = 0.1; // 10% tax
    const discountRate = 0.05; // 5% discount for orders over 500,000 UZS
  
    // Function to calculate and display the total order
    function calculateOrder() {
      let totalPrice = 0;
  
      // Loop through all menu items
      document.querySelectorAll(".menu_box").forEach(menuBox => {
        const quantity = parseInt(menuBox.querySelector(".number-display").textContent);
        if (quantity > 0) {
          const priceText = menuBox.querySelector(".menu_price span").textContent;
          const price = parseInt(priceText.replace(",", "").replace(" UZS", ""));
          totalPrice += price * quantity;
        }
      });
  
      // Calculate tax and discount
      const tax = Math.round(totalPrice * taxRate);
      const discount = totalPrice > 500000 ? Math.round(totalPrice * discountRate) : 0;
      const finalTotal = totalPrice + tax - discount;
  
      // Update modal elements
      taxElement.textContent = `${tax.toLocaleString()} UZS`;
      discountElement.textContent = `${totalPrice > 500000 ? discountRate * 100 : 0}%`;
      totalElement.textContent = `${finalTotal.toLocaleString()} UZS`;
  
      // Show the modal
      orderInfo.style.display = "block";
    }
  
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
    orderButton.addEventListener("click", () => {
      calculateOrder(); // Calculate totals and display modal
    });
  
    // Hide the modal when clicked outside or after an action
    orderInfo.addEventListener("click", (event) => {
      if (event.target === orderInfo) {
        orderInfo.style.display = "none";
      }
    });
  });
  