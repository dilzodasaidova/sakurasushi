// Constants
const BASE_HISTORY_API_URL = "http://localhost:8080/api/order/history";

// Elements
const historyTableBody = document.getElementById("historyTableBody");
const noHistoryMessage = document.getElementById("noHistoryMessage");

// Fetch and Display Order History
async function fetchOrderHistory() {
    try {
        const response = await fetch(BASE_HISTORY_API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch order history.");
        }

        const historyData = await response.json();
        if (historyData.length === 0) {
            noHistoryMessage.classList.remove("d-none");
            return;
        }

        populateHistoryTable(historyData);
    } catch (error) {
        console.error("Error fetching order history:", error);
        noHistoryMessage.textContent = "Error fetching order history. Please try again later.";
        noHistoryMessage.classList.remove("d-none");
    }
}

// Populate the Table
function populateHistoryTable(data) {
    historyTableBody.innerHTML = ""; // Clear any existing rows

    data.forEach(order => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${order.totalOrderSum.toLocaleString()} UZS</td>
            <td>${order.discountPercentage}%</td>
            <td>${order.discountAmount.toLocaleString()} UZS</td>
            <td>${order.taxRate}%</td>
            <td>${order.taxAmount.toLocaleString()} UZS</td>
            <td>${order.finalAmount.toLocaleString()} UZS</td>
            <td>${order.region}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
        `;

        historyTableBody.appendChild(row);
    });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    fetchOrderHistory();
});
