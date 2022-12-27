const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const txml = require("txml");
const axios = require("axios");
const droneFunctions = require("./utils/functions");
const PORT = process.env.PORT || 5000;

//middlewares
app.use(cors());

//-----------------------------------------------------------------------------------------------------------

//Destructuring the functions
const { calculateDistance, updateDataToDisplay, deletingDronesInfo } =
  droneFunctions;

//-----------------------------------------------------------------------------------------------------------

// Defining variables to push data
const dataToDisplay = [];
var allDronesData = [];

//-----------------------------------------------------------------------------------------------------------

//Fetching Data every two seconds
setInterval(() => {
  axios
    .get("https://assignments.reaktor.com/birdnest/drones")
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      const dronesData = txml.simplify(txml.parse(data)).report.capture.drone;
      const snapshotTimestamp = txml.simplify(txml.parse(data)).report.capture
        ._attributes;
      allDronesData = dronesData;
      allDronesData.forEach((drone) => {
        drone.snapshotTime = snapshotTimestamp.snapshotTimestamp;
      });
      return dronesData;
    })
    .then((data) => {
      //Retrieving the drone SN and using it to fetch the pilots data
      return Promise.all(
        data.map(async (singleDroneData) =>
          axios
            .get(
              "https://assignments.reaktor.com/birdnest/pilots/" +
                singleDroneData.serialNumber
            )
            .then((response) => response.data)
            .then((singlePilotData) => {
              return singlePilotData;
            })
        )
      );
    })
    .then((pilotsData) => { //Combining pilots data and drones data into one object
      return { pilotsData: pilotsData, dronesData: allDronesData };
    })
    .then((data) => {
      for (let i = 0; i < data.dronesData.length; i++) {
        const drone = { //Creating a special object with pilot information and some drone informations
          droneSerialNum: data.dronesData[i].serialNumber,
          distance: calculateDistance(
            data.dronesData[i].positionX,
            data.dronesData[i].positionY,
            250000,
            250000
          ),

          pilotName:
            data.pilotsData[i].firstName + " " + data.pilotsData[i].lastName,
          email: data.pilotsData[i].email,
          phone: data.pilotsData[i].phoneNumber,
          snapshotTime: new Date(data.dronesData[i].snapshotTime),
          snapShortAppearances: 1,
          lastSeen: 0,
        };

        updateDataToDisplay(drone, dataToDisplay);
      }
    });
}, 2000);

//-----------------------------------------------------------------------------------------------------------

//Cleaning the displayed data by removing old drones every 1/2 minute
setInterval(() => {
  deletingDronesInfo(dataToDisplay);
}, 500);

//-----------------------------------------------------------------------------------------------------------

//Routes
app.get("/", (req, res) => {
  res.json(dataToDisplay);
});

//-----------------------------------------------------------------------------------------------------------

//Starting the server
app.listen(PORT, () => {
  console.log("Server listening on port 5000");
});
