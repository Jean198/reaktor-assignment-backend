const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const txml = require("txml");
const axios = require("axios");
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());




//Starting the server
app.listen(PORT, () => {
    console.log("Server listening on port 5000");
  });