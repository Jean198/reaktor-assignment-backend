const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const txml = require("txml");
const axios = require("axios");
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());


// fetching the drones data
axios
    .get("https://assignments.reaktor.com/birdnest/drones")
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      const dronesData = txml.simplify(txml.parse(data)).report.capture.drone;
      console.log(dronesData);
    })




//Starting the server
app.listen(PORT, () => {
    console.log("Server listening on port 5000");
  });