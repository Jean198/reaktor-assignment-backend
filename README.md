# Reaktor assignment frontend
Link to the assignment: https://assignments.reaktor.com/birdnest

## 1. Prerequisites
The application is build into two separate directories:

*  ### Backend:
The backend is built with **JavaScript**, **Node js** and **Express js** framework. To run the backend, you need to run " **npm install** " to install all required packages and then " **npm start** " to start the application.

* ### Frontend:
The frontend is built with JavaScript and React library. To run the application, make sure your backend is running. Then add a .env file in the root directory. In the .env file add this line REACT_APP_URL_ENDPOINT=http://localhost:5000 and type "* npm start * ".

## 2. How the backend works:
The backend uses nested axios requests.The requests are made every 2 seconds. First the snapshot with drones information is fetched. Then from the drone information I retrieve the drone Serial Number to be passed to the pilots endpoint to fetch the pilot's information.

The backend performs all the calculations and sends to the frontend a ready array of objects to display.

## 2. How the frontend works:
The frontend just fetch the object sent from the backend and displays the information in a table. The fetch is performed every 10 reconds using a setInterval function. This helps the user not to manually refresh to see uptodate information.

## 4. Challenges faced
*  Not able to fetch the data from the profovided endpoints directly from the frontend because of CORS. I had to setup own server to be able to achieve this.

* Somehow my server is sleeping when not getting requests. So the first user who will visit the application will start the server and all other visitors will see the information the first user is seing.

* I am using the free plan of www.render.com, I have deployed the application in two separate projects.

## 5. Tools used
* JavaScript
* React
* Node js
* Express js