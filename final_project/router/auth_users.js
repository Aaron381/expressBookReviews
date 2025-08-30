const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const matches = users.filter((user) => user.username === username);
    return matches.length < 0;
}
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let token = jwt.sign({data:password}, "access", {expiresIn: 3600});
  req.session.authorization = {token,username};

  return res.status(200).json({ message: "Login successful", token: token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        delete books[isbn].reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
