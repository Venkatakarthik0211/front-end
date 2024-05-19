document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the cart data from localStorage
    const cartData = JSON.parse(localStorage.getItem("shoppingCart"));

    const cartListContainer = document.getElementById("cart-list");

    if (cartData && cartData.length > 0) {
        cartData.forEach((item) => {
            const row = document.createElement("tr");

            // Calculate and update the Available quantity
            const availableAfterPurchase = item.available - item.quantity;

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.author}</td>
                <td>${availableAfterPurchase}</td> <!-- Display the updated Available quantity -->
                <td>${item.quantity}</td>
            `;

            cartListContainer.appendChild(row);
        });
    } else {
        // Handle the case where the cart is empty
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td colspan='5'>Your cart is empty</td>";
        cartListContainer.appendChild(emptyRow);
    }
});
