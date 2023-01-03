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
const { calculateDistance, updateDataToDisplay, calculateElapsedTime } =
  droneFunctions;

//-----------------------------------------------------------------------------------------------------------

// Defining variables to push data
var dataToDisplay = []; // the last array to send to the frontend
var allDronesData = []; //

//-----------------------------------------------------------------------------------------------------------

//Remove drones that has been last seen more than ten mins ago and updating lastseen for all drones
const deletingDronesInfo = () => {
  dataToDisplay = dataToDisplay.filter((data) => !(calculateElapsedTime(new Date(), data.snapshotTime) > 9));

  dataToDisplay.forEach(
    (data) =>
      (data.lastSeen = calculateElapsedTime(new Date(), data.snapshotTime))
  );
};

//Fetching Data every two seconds
setInterval(() => { // setInterval function that will fetch data every 2 seconds
  axios
    .get("https://assignments.reaktor.com/birdnest/drones") // fetching drones information
    .then((response) => {
      return response.data;
    })
    .then((data) => {
      const dronesData = txml.simplify(txml.parse(data)).report.capture.drone;//gettting the drones data from the snapshot
      const snapshotTimestamp = txml.simplify(txml.parse(data)).report.capture //getting the snapshot time
        ._attributes;
      allDronesData = dronesData; // assigning drones data to a global variable to be used outside this scope
      allDronesData.forEach((drone) => {
        drone.snapshotTime = snapshotTimestamp.snapshotTimestamp;
      });
      return dronesData;
    })
    .then((data) => {

      return Promise.all(
        data.map((singleDroneData) =>
          axios
            .get(
              "https://assignments.reaktor.com/birdnest/pilots/" + //Using the drone Serial number to fetch the corresponding pilot data
                singleDroneData.serialNumber
            )
            .then((response) => response.data)
            .then((singlePilotData) => {
              return singlePilotData; // corresponding pilot is returned
            })
        )
      );
    })
    .then((pilotsData) => {
      return { pilotsData: pilotsData, dronesData: allDronesData }; //Combining pilots data and drones data into one object
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

        updateDataToDisplay(drone, dataToDisplay); // using the function to add new drones to the final array or replacing existing drones that just got caught again.
      }
    });
}, 2000);

//-----------------------------------------------------------------------------------------------------------

//Running the function that removes drones that has been seen more than 10 mins ago. This is done every 1/2 second
setInterval(() => {

  deletingDronesInfo(dataToDisplay);
}, 1000);

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
