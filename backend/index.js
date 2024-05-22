require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
const routes = require("./routes/routes");
app.use("/api", routes);

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

app.listen(8000, () => {
  console.log(`Server Started at ${8000}`);
});

// Export the app for Vercel
module.exports = app;
