function updateLocalStorage() {
	localStorage.setItem("LMSLibrary", JSON.stringify(LMS.library));
}
function retrieveLibrary() {
	return JSON.parse(localStorage.getItem("LMSLibrary"));
}

// book object  // constructor construct to create objects of book

function Book(id, title, author) {
	this.id = id;
	this.title = title;
	this.author = author;
	this.isBorrowed = false;
}

const LMS = {
	// library array
	library: retrieveLibrary() ?? [], //retrieve() will return the array of books if present in localstorage

	//checking if same book already registered or not
	//isregistered will return null if book is not registerd in the system
	isRegisterd: function (id) {
		for (let b of this.library) {
			if (b.id === id) {
				return b;
			}
		}
		return null;
	},

	// whether book is present or not

	// adding book to the library
	addBookToList: function (id, title, author) {
		if (!this.isRegisterd(id)) {
			//if not registered then add the object in the library

			this.library.push(new Book(id, title, author));
			alert(`Book with id- "${id}" title '${title}' author '${author}' has been added to the library `);

			updateLocalStorage();
		} else {
			alert(`Book with id- "${id}" already registered with system`);
		}
	},

	// borrowing book

	borrowBook: function (id) {
		const book = this.isRegisterd(id);

		if (!book) {
			alert(`Book id-  "${id}" is invalid`);
			return;
		}

		if (book.isBorrowed) {
			//if already borrowed
			alert(`Book with id -  "${book.id}" currently not available .`);
		} else {
			book.isBorrowed = true;
			alert(`Book with id - "${book.id}" has been borrowed`);
			updateLocalStorage();
		}
	},

	// retrun book
	returnBook: function (id) {
		const book = this.isRegisterd(id);

		if (!book) {
			alert(`Book id- "${id}" is invalid`);
			return;
		}

		book.isBorrowed = false;

		alert(`Book id- "${id}" Returned`);

		updateLocalStorage();
	},

	// available books
	bookList: function () {
		//passing separate copy of array ;
		return [...this.library];
	},

	//searching for a book

	searchBook: function (title) {
		for (let b of this.library) {
			if (b.title.toLowerCase() === title) {
				alert("Book found ");
				return b;
			}
		}
		alert("Book not found");
		return null;
	},
	serachBookWithPrefix(prefix) {
		return this.library.filter((ele) => ele.title.toLowerCase().startsWith(prefix));
	},
};

// ===============================
//DOM MANUPULATION

//SELECTING CONTAINER WHERE WE PUT EVER OUTPUT
const outputContainer = document.querySelector("main .right");

const sectionHtml = {
	table: `
<table class="book-list-table">
					<thead>
						<tr>
							<th class="sno">SNO</th>
							<th class="id-head">id</th>
							<th class="title-head">TITLE</th>
							<th class="author-head">AUTHOR</th>
							<th class="status-head">STATUS</th>
						</tr>
					</thead>
					<tbody> </tbody>
				</table>	
	`,
	addBookSection: `<section id="add-book-section" class="section">
					<h1>ADD BOOK SECTION</h1>
					<form action="">
						<div>
							<label for="book-id">BOOK ID: </label>
							<input type="text" name="book-id" id="book-id" required />
						</div>
						<div>
							<label for="book-author">BOOK AUTHOR:</label>
							<input type="text" name="book-author" id="book-author" required />
						</div>
						<div>
							<label for="book-title">BOOK TITLE:</label>
							<input type="text" name="book-title" id="book-title" required />
						</div>

						<div><button class="btn" id="submit-btn">SUBMIT</button></div>
					</form>
				</section>
`,
	bookListSection: `<section class="section" id="book-list-section">
					<h1>LIST OF BOOKS</h1>
					<table class="book-list-table">
					<thead>
						<tr>
							<th class="sno">SNO</th>
							<th class="id-head">id</th>
							<th class="title-head">TITLE</th>
							<th class="author-head">AUTHOR</th>
							<th class="status-head">STATUS</th>
						</tr>
					</thead>
					<tbody> </tbody>
				</table>
				</section>`,

	serachSection: `<section id="search-section">
						<h1>SEARCH SECTION</h1>

					<form action="">
						<input type="text" placeholder="SEARCH BY TITLE" id="search-bar" />
						
					</form>
					<div class="search-output-container"> </div>
				</section>`,
};

// =======================
//SELECTING MAIN MENU BUTTONS
const addBtnEle = document.querySelector(".add-btn");
const listBtnEle = document.querySelector(".list-btn");
const searchBtnEle = document.querySelector(".search-btn");

// function on click on each button
function activeTabBtn(clickedBtn) {
	addBtnEle.classList.remove("active");
	searchBtnEle.classList.remove("active");
	listBtnEle.classList.remove("active");

	clickedBtn.classList.add("active");
}

// ===============================
// SECTIONS ===================

//BOOK SECTION
function addBook(event) {
	event.preventDefault(); //to prevent refresh of page

	const regExp = /^[0-9]+$/; //only no. is allowed in id of a book

	const idEle = outputContainer.querySelector("#book-id");
	const authorEle = outputContainer.querySelector("#book-author");
	const titleEle = outputContainer.querySelector("#book-title");

	const id = idEle.value.trim();
	const author = authorEle.value.trim();
	const title = titleEle.value.trim();

	// checking for invalid input
	if (!regExp.test(id)) {
		alert("Book id can only be a numeric value");
		idEle.style.border = "red 2px solid";
		return;
	} else {
		idEle.style.border = "";
	}

	if (author === "") {
		authorEle.style.border = "red 2px solid";
		return;
	} else {
		authorEle.style.border = "";
	}

	if (title === "") {
		titleEle.style.border = "red 2px solid";
		return;
	} else {
		titleEle.style.border = "";
	}

	LMS.addBookToList(id, title, author);

	// resetting the input elements
	idEle.value = "";
	authorEle.value = "";
	titleEle.value = "";

	/* 	event.target.removeEventListener("click", addBook);
	outputContainer.innerHTML = ""; */
}

function showAddSection() {
	outputContainer.innerHTML = sectionHtml.addBookSection;

	activeTabBtn(addBtnEle);

	const addBookSection = outputContainer.querySelector("#add-book-section");
	const submitBtn = addBookSection.querySelector("#submit-btn");

	submitBtn.addEventListener("click", addBook);
}

addBtnEle.addEventListener("click", showAddSection);

//////////////////////////////////////////////////////
//displaying books
// const bookListSection = outputContainer.querySelector("#book-list-section");

function createEntry(sno, { id, title, author, isBorrowed: borrowed }) {
	const tableRow = document.createElement("tr");

	const status = borrowed ? "Return" : "Borrow";

	tableRow.innerHTML = `<tr>
							<td class="sno">${sno}</td>
							<td class="id-val">${id}</td>
							<td class="title-val">${title}</td>
							<td class="author-val">${author}</td>
							<td class="status-val"> <button class="status-btn ${status}-btn" data-id="${id}"  >${status}</button></td>
						</tr>`;

	return tableRow;
}

function returnBookBtnFn(target) {
	target.classList.add("Borrow-btn");
	target.classList.remove("Return-btn");
	target.textContent = "Borrow";

	LMS.returnBook(target.dataset.id);
}

function borrowBookBtnFn(target) {
	target.classList.remove("Borrow-btn");
	target.classList.add("Return-btn");
	target.textContent = "Return";

	LMS.borrowBook(target.dataset.id);
}

function returnBorrow(data) {
	if (data.target.classList.contains("Borrow-btn")) borrowBookBtnFn(data.target);
	else if (data.target.classList.contains("Return-btn")) returnBookBtnFn(data.target);
}

function showBookList() {
	outputContainer.innerHTML = sectionHtml.bookListSection;

	activeTabBtn(listBtnEle);

	const list = LMS.bookList();

	const tbody = document.querySelector("#book-list-section tbody");

	tbody.addEventListener("click", returnBorrow);

	for (let i = 0; i < list.length; i++) {
		tbody.appendChild(createEntry(i + 1, list[i]));
	}
}

listBtnEle.addEventListener("click", showBookList);

///////////////////////////////////////////////////////
// serach button functionality
/* 
function performSearch(e) {
	e.preventDefault();

	const inputTitle = outputContainer.querySelector("#search-bar");
	const searchOutputContainer = outputContainer.querySelector("#search-section .search-output-container");

	searchOutputContainer.innerHTML = "";

	const div = document.createElement("div");

	const book = LMS.searchBook(inputTitle.value.toLowerCase());

	if (book) {
		div.innerHTML = sectionHtml.table;
		const tbody = div.querySelector("tbody");
		tbody.appendChild(createEntry(1, book));

		searchOutputContainer.appendChild(div);
	}
}
 */

function searchResults(e) {
	const prefix = e.target.value.toLowerCase().trim();

	if (!prefix) {
		//if prefix is empty the no need to print the list
		return;
	}

	const filteredBooks = LMS.serachBookWithPrefix(prefix);
	const searchOutputContainer = outputContainer.querySelector("#search-section .search-output-container");
	const div = document.createElement("div");

	searchOutputContainer.innerHTML = "";
	div.innerHTML = sectionHtml.table;

	const tbody = div.querySelector("tbody");

	tbody.addEventListener("click", returnBorrow);

	filteredBooks.forEach((book, index) => {
		tbody.appendChild(createEntry(index, book));
		searchOutputContainer.appendChild(div);
	});
}

function showSearch() {
	outputContainer.innerHTML = sectionHtml.serachSection;

	activeTabBtn(searchBtnEle);

	outputContainer.querySelector("#search-bar").addEventListener("input", searchResults);
}

searchBtnEle.addEventListener("click", showSearch);
