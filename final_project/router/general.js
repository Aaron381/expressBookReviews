const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password ) {
        return res.status(400).json({message: "Username and password are required"});
    }

    if (isValid(username)) {
        return res.status(409)>express.json({message: "Username already exists"})
    }

    users.push({"username":username,"password":password});

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then((books) => {
        res.send(JSON.stringify(books, null, 4));
    })
    .catch((error) => {
        res.status(500).send(error);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    })
    .then(book => res.send(book))
    .catch(err => res.status(404).send(err));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const matchingBooks = [];

        keys.forEach((key) => {
            if (books[key].author === author) {
                matchingBooks.push(books[key]);
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found by the author");
        }
    })
    .then((books) => res.send(JSON.stringify(books, null, 4)))
    .catch((error) => res.status(404).send(error));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;


    new Promise((resolve, reject) => {
        const keys = Object.keys(books);
        const matchingBooks = [];

        keys.forEach((key) => {
            if (books[key].title === title) {
                matchingBooks.push(books[key]);
            }
        });

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found with the given title");
        }
    })
    .then((matchingBooks) => {
        res.send(JSON.stringify(matchingBooks, null, 4));  // Neatly formatted JSON response
    })
    .catch((error) => {
        res.status(404).send(error);
    });
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
