//Calculate the distance between drones and the nest
const calculateDistance = (x1, y1, x2, y2) => {
  let y = x2 - parseFloat(x1);
  let x = y2 - parseFloat(y1);
  distance = Math.sqrt(x * x + y * y);
  distanceInMeters = Math.round(distance / 1000);
  return distanceInMeters;
};
//-----------------------------------------------------------------------------------------------------------

//Calculate the elapsed time since the drone has been captured by the device
const calculateElapsedTime = (currentTime, capturedTime) => {
  var timeDiff = currentTime - capturedTime;
  timeDiffInMins = timeDiff / 1000 / 60;
  var minutes = Math.round(timeDiffInMins);
  return minutes;
};

//-----------------------------------------------------------------------------------------------------------

//Updating the existing drones information or adding new captured drones information
const updateDataToDisplay = (newrlyCapturedDrone, dataToDisplay) => {
  if (newrlyCapturedDrone.distance - 100 < 0) {
    for (var i = 0; i < dataToDisplay.length; i++) {
      if (
        dataToDisplay[i].droneSerialNum === newrlyCapturedDrone.droneSerialNum
      ) {
        newrlyCapturedDrone.snapShortAppearances =
          dataToDisplay[i].snapShortAppearances;
        newrlyCapturedDrone.lastSeen = calculateElapsedTime(
          new Date(),
          newrlyCapturedDrone.snapshotTime
        );
        newrlyCapturedDrone.snapShortAppearances++;
        dataToDisplay[i] = newrlyCapturedDrone;
        return;
      }
    }

    dataToDisplay.push(newrlyCapturedDrone);
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
  calculateDistance,
  updateDataToDisplay,
  deletingDronesInfo,
};
