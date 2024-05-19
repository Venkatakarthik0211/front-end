// Sample data for books
const books = [
    { id: 1, title: "The Psychology Of Money", author: "Morgan Houusel", subject: "Fiction", publishDate: "2022-01-15", available: 5, quantity: 0 },
    { id: 2, title: "How Innovation Works", author: "Matt Ridley", subject: "Mystery", publishDate: "2021-05-20", available: 3, quantity: 0 },
    { id: 3, title: "The Picture of Dorian Gray", author: "Oscar Wilde", subject: "Science Fiction", publishDate: "2020-12-10", available: 7, quantity: 0 },
    { id: 4, title: "The Subtle Art Of Not Giving A F*ck", author: "Mark Manson", subject: "Mystery", publishDate: "2022-03-08", available: 2, quantity: 0 },
    { id: 5, title: "101 Essays that will change the way you think", author: "Author 3", subject: "Mystery", publishDate: "2022-04-08", available: 4, quantity: 0 },
    { id: 6, title: "Companyy Of One", author: "Author 3", subject: "Mystery", publishDate: "2022-04-08", available: 6, quantity: 0 },
];

// Shopping cart to store selected books
const shoppingCart = [];

// Function to create a table row for a book
function createBookTableRow(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.subject}</td>
        <td>${book.publishDate}</td>
        <td><span class="search-icon" onclick="searchGoogle('${book.title}')">&#128269;</span></td>
        <td>${book.available}</td>
        <td>${book.quantity}</td>
        <td><button class="add-quantity-btn" data-book-id="${book.id}" onclick="addToCart(${book.id})">+</button></td>
    `;

    // Add event listener to the "+" button to increment the quantity
    const addQuantityBtn = row.querySelector(".add-quantity-btn");
    addQuantityBtn.addEventListener("click", () => {
        const bookId = parseInt(addQuantityBtn.getAttribute("data-book-id"), 10);
        const book = books.find((b) => b.id === bookId);
        if (book && book.quantity < book.available) {
            book.quantity++;
            row.querySelector("td:nth-child(8)").textContent = book.quantity; // Update the quantity cell
            updateCartItemCount();
        }
    });

    return row;
}

// Display the list of books in the table
const bookListContainer = document.getElementById("book-list");
books.forEach((book) => {
    const row = createBookTableRow(book);
    bookListContainer.appendChild(row);
});

// Function to perform a Google search based on the book title
function searchGoogle(title) {
    const searchQuery = encodeURIComponent(title);
    const googleSearchUrl = `https://www.google.com/search?q=Related books like ${searchQuery}`;
    window.open(googleSearchUrl, "_blank");
}

// Function to add a book to the shopping cart
function addToCart(bookId) {
    // Find the book by its ID
    const book = books.find((b) => b.id === bookId);

    // Check if the book is already in the cart
    const existingBook = shoppingCart.find((cartBook) => cartBook.id === book.id);

    if (existingBook) {
        // If the book is already in the cart, increment its quantity
        existingBook.quantity++;
    } else {
        // If the book is not in the cart, add it with a quantity of 1
        shoppingCart.push({ ...book, quantity: 1 });
    }

    // Update the cart item count
    updateCartItemCount();
}

// Function to update the count of books
function updateBookCount(count) {
    const bookCountElement = document.getElementById("book-count");
    bookCountElement.textContent = `Total Books: ${count}`;
}

// Function to update the cart item count
function updateCartItemCount() {
    const cartItemCountElement = document.getElementById("cart-item-count");
    const itemCount = shoppingCart.reduce((total, book) => total + book.quantity, 0);
    cartItemCountElement.textContent = itemCount;
}

// Calculate and display the count of books
updateBookCount(books.length);

// Sort the table by column index
function sortTable(columnIndex) {
    const table = document.querySelector("table");
    const tbody = document.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        const textA = a.querySelector(`td:nth-child(${columnIndex})`).textContent;
        const textB = b.querySelector(`td:nth-child(${columnIndex})`).textContent;
        return textA.localeCompare(textB);
    });

    rows.forEach((row) => {
        tbody.appendChild(row);
    });
}

// Filter the table based on input values
function filterBooks() {
    const titleInput = document.querySelector('input[placeholder="Filter by Title"]').value.toLowerCase();
    const authorInput = document.querySelector('input[placeholder="Filter by Author"]').value.toLowerCase();
    const subjectInput = document.querySelector('input[placeholder="Filter by Subject"]').value.toLowerCase();
    const dateInput = document.querySelector('input[placeholder="Filter by Publish Date"]').value.toLowerCase();

    const rows = document.querySelectorAll("tbody tr");

    let visibleCount = 0;

    rows.forEach((row) => {
        const title = row.querySelector("td:nth-child(2)").textContent.toLowerCase();
        const author = row.querySelector("td:nth-child(3)").textContent.toLowerCase();
        const subject = row.querySelector("td:nth-child(4)").textContent.toLowerCase();
        const date = row.querySelector("td:nth-child(5)").textContent.toLowerCase();

        if (
            title.includes(titleInput) &&
            author.includes(authorInput) &&
            subject.includes(subjectInput) &&
            date.includes(dateInput)
        ) {
            row.style.display = "";
            visibleCount++;
        } else {
            row.style.display = "none";
        }
    });

    // Update the count of visible books
    updateBookCount(visibleCount);
}

// Function to navigate to cart.html
function goToCart() {
    // Store the cart data in localStorage
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

    window.location.href = "cart.html";
}
