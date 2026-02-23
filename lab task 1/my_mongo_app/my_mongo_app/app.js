// app.js
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");

require("./config/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve HTML form
app.use(express.static("public"));

// routes
app.use("/users", require("./routes/userRoutes"));

app.listen(5000, () => console.log("Server running on 5000"));
