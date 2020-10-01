const addNewBook = document.querySelector('.new-book');
const form = document.querySelector('#book-form');
const removeAll = document.querySelector('.remove-all');
const tableBody = document.querySelector('.body');
const table = document.querySelector('#books-list');
const books = document.querySelector('.books');

// Show form when "Add New Book" is clicked
addNewBook.addEventListener('click', function() {
	form.style.display = 'flex';
	addNewBook.classList.add('hidden');
});

class Book {
	constructor(title, author, pages, isRead, id) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this.isRead = isRead;
		this.id = id;
	}
}

// What to show to user
class UI {
	static displayBooks() {
		const storedBooks = Storage.getFromStorage();

		storedBooks.forEach((book) => UI.addToUi(book));
	}

	static addToUi(book) {
		const row = document.createElement('tr');
		const isRead =
			book.isRead ? 'Read' :
			'Not Read';

		row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.pages}</td>
         <td>${isRead}</td>
         <input type="hidden" data-id="${book.id}">
         <td><a href="#" class="delete">X</a></td>
      `;

		tableBody.appendChild(row);
	}

	static showMessage(message, className) {
		const div = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		books.insertBefore(div, table);

		setTimeout(function () {
			location.reload();
			document.querySelector('.alert').remove();
		 }, 800);
	}
}

removeAll.addEventListener('click', () => {
	localStorage.removeItem('books');
	location.reload();
});

class AddToLib {
	static getInput(title, author, pages, isRead) {
		const library = Storage.getFromStorage();
		let id = library.length;
		id++;
		const book = new Book(title, author, pages, isRead, id);
		library.push(book);
		Storage.addToStorage(library);

		UI.showMessage('Book added successfuly', 'success');
	}
}

class Storage {
	static addToStorage(books) {
		localStorage.setItem('books', JSON.stringify(books));
	}

	static getFromStorage() {
		if (localStorage.getItem('books') === null) {
			removeAll.style.display = 'none';
			return [];
		} else {
			removeAll.style.display = 'block';
			return JSON.parse(localStorage.getItem('books'));
		}
	}

	static removeFromStorage(id) {
		const library = Storage.getFromStorage();
		const books = library.filter((book) => book.id !== parseInt(id));
		Storage.addToStorage(books);
		location.reload();
	}
}

form.addEventListener('submit', (e) => {
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const pages = document.querySelector('#pages').value;
	const isRead = document.querySelector('#read').checked;

	e.preventDefault();

	if (title === '' || author === '' || pages === '') {
		alert('Please fill out all the fields');
	} else {
		AddToLib.getInput(title, author, pages, isRead);
		form.style.display = 'none';
		addNewBook.classList.remove('hidden');
	}
});

tableBody.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete')) {
		Storage.removeFromStorage(e.target.parentElement.previousSibling.previousSibling.dataset.id);
		e.target.parentElement.parentElement.remove();
	}
});

document.addEventListener('DOMContentLoaded', UI.displayBooks);
