const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user
    users.push({ username, password });

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;  // Retrieve the ISBN from the URL parameter
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4)); // Send book details as formatted JSON
    } else {
        res.status(404).send("Book not found");
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;  // Get author from URL parameter
    const matchingBooks = [];

    // Get all ISBN keys from books object
    const keys = Object.keys(books);

    // Iterate through books to find those matching the author
    keys.forEach((key) => {
        if (books[key].author === author) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Send matching books as JSON
    } else {
        res.status(404).send(`No books found by author: ${author}`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;  // Get title from URL parameter
    const matchingBooks = [];

    // Get all ISBN keys from books object
    const keys = Object.keys(books);

    // Iterate through books to find those matching the author
    keys.forEach((key) => {
        if (books[key].title === title) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        res.send(JSON.stringify(matchingBooks, null, 4)); // Send matching books as JSON
    } else {
        res.status(404).send(`No books found with that title: ${title}`);
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;  // Retrieve the ISBN from the URL parameter
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn], null, 4)); // Send book details as formatted JSON
    } else {
        res.status(404).send("Book not found");
    }
});

module.exports.general = public_users;
