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
      //console.log(dronesData);
      return dronesData
    }).then((data) => {   //Retrieving the drone SN and using it to fetch the pilots data
      return Promise.all(
        data.map(async (singleDroneData) =>
          axios
            .get(
              "https://assignments.reaktor.com/birdnest/pilots/" + singleDroneData.serialNumber
            )
            .then((response) => response.data)
            .then((singlePilotData) => {
              console.log(singlePilotData)
              return singlePilotData;
            })
        )
      );
    })




//Starting the server
app.listen(PORT, () => {
    console.log("Server listening on port 5000");
  });