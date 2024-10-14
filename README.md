# fitbit-oauth

# Frontend for FitBit OAuth

## Steps to Start local development frontend
1. cd fitbit-frontend
2. npm install
3. npm start (starts at localhost:3000)
4. npm run build (if needed to create build directory)

# Backend for FitBit Authorization

server.js ==> Entry point of the incoming 

.env ==> replace the enviroment variables 

## Note: 
- Currently in frontend backend api port is hard-coded to 4000, if needed to change please update in frontend code
- In App settings mentioned to port 4000 for redirect url

## API's available in express backend
- '/api/authorize' --> Initiate OAutg flow - Redirect user to fitbit for authorization
- '/api/callback' --> Handle the redirect after authorization - exchange the authorization code, redirects to frontend with auth code in url
- '/api/fetchData' --> Fetch the person data after exchange access token success

## Steps to Start local development server
1. cd fitbit-backend
2. npm install
3. node server.js or nodemon server.js (MongoDB Connection success and server runs at port 4000)

## Set up the MongoDB 
- Make sure MongoDB is installed on the machine and running locally in MongoDB Atlas Service
- command: mongod --dbpath ~/data/db