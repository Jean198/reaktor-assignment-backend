//Calculate the distance between a drone and the nest
const calculateDistance = (x1, y1, x2, y2) => {
  let y = x2 - parseFloat(x1);
  let x = y2 - parseFloat(y1);
  distance = Math.sqrt(x * x + y * y);
  distanceInMeters = Math.round(distance / 1000);
  return distanceInMeters;
};
//-----------------------------------------------------------------------------------------------------------

//Calculate the elapsed time since the drone has been caught by the device
const calculateElapsedTime = (currentTime, caughtTime) => {
  var timeDiff = currentTime - caughtTime;
  timeDiffInMins = timeDiff / 1000 / 60;
  var minutes = Math.round(timeDiffInMins);
  return minutes;
};

//-----------------------------------------------------------------------------------------------------------

//Updating the existing drones information or adding new caught drones information
const updateDataToDisplay = (newrlycaughtDrone, dataToDisplay) => {
  if (newrlycaughtDrone.distance - 100 < 0) {
    for (var i = 0; i < dataToDisplay.length; i++) {
      if (
        dataToDisplay[i].droneSerialNum === newrlycaughtDrone.droneSerialNum // Check if the the drone is already in the array
      ) {
        if (dataToDisplay[i].distance > newrlycaughtDrone.distance) { // compare the distances, if the new drone's distance is small, replace the old drone
          newrlycaughtDrone.snapShortAppearances =
            dataToDisplay[i].snapShortAppearances;
          newrlycaughtDrone.lastSeen = calculateElapsedTime(
            new Date(),
            newrlycaughtDrone.snapshotTime
          );
          newrlycaughtDrone.snapShortAppearances++;
          dataToDisplay[i] = newrlycaughtDrone;

        }
        return;
      }
    }

    dataToDisplay.push(newrlycaughtDrone);
  }
};

//Remove drones that has been last seen more than ten mins ago and updating lastseen for all drones
const deletingDronesInfo = (dataToDisplay) => {
  dataToDisplay = dataToDisplay.filter(
    (data) => !(calculateElapsedTime(new Date(), data.snapshotTime) > 10)
  );
  dataToDisplay.forEach(
    (data) =>
      (data.lastSeen = calculateElapsedTime(new Date(), data.snapshotTime))
  );
};

module.exports = {
  // exporting the functions
  calculateDistance,
  updateDataToDisplay,
  deletingDronesInfo,
};
