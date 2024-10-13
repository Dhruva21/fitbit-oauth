// server.js (or app.js)

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();
const Token = require('./models/Token');  // Import the Token model
const cors = require('cors');
const {generateCodeVerifier, generateCodeChallenge} = require('./utils');

const app = express();
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/fitbitAuthDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// OAuth flow variables
let codeVerifier;

// Step 1: Initiate OAuth flow - Redirect user to Fitbit for authorization
app.get('/api/authorize', (req, res) => {
  
  // Get the code verifier (43-128 bytes long)
  codeVerifier = generateCodeVerifier();
  // SHA-256 of code verifier
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const CLIENT_ID = process.env.FITBIT_CLIENT_ID;
  const scope = 'activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight';
  
  /**
   * The required query parameters are:
   * client_id: The Fitbit API application ID from https://dev.fitbit.com/apps 
   * scope: A space-delimited list of data collections requested by the application.
   * code_challenge: The base64url-encoded SHA256 hash of the code verifier
   * code_challenge_method: S256
   * response_type: code
   * 
   * Example from fitbit api doc
   * https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23PV24&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=_lWO3Pm6YtKTJ2DTYgH0DZn6rI71saoCbJ-s0Q2aadY&code_challenge_method=S256&state=3w0r3g0751626c563t4h1a3g6r0x1l1t
   */
  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  
  res.redirect(authUrl);  // Redirect user to Fitbit for authorization
});

// Step 2: Handle the redirect after authorization - Exchange the authorization code for access tokens
app.get('/api/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // Exchange the authorization code for an access token
    const response = await axios.post('https://api.fitbit.com/oauth2/token', querystring.stringify({
      client_id: process.env.FITBIT_CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      code_verifier: codeVerifier,  // Send the code verifier
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64'),
      },
    });

    const { access_token, refresh_token, expires_in, user_id } = response.data;
    
    // Step 3: Save the tokens in MongoDB
    try {
        const token = new Token({
          userId: user_id,
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresIn: expires_in,
        });
      
        const savedToken = await token.save();  // Save to MongoDB
        // console.log('Token saved successfully:', savedToken);  // Check if token was saved successfully
    } catch (error) {
        console.error('Error saving token to MongoDB:', error);
    }
      

    // Redirect the user to the landing page adding the access as well
    // The #_=_ fragment identifier at the end of the below, it's just to maintain teh consistency
    const frontendRedirectUrl = process.env.FRONTEND_REDIRECT_URI || 'http://localhost:3000/landing-page';
    
    res.redirect(frontendRedirectUrl+`?access_token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging token:', error.response ? error.response.data : error.message);
    res.status(500).send('Token exchange failed');
  }
});

// Fetch the person data after exchange access - token success
app.post('/api/fetchData', async (req, res) => {
    const access_token = req.body.access_token;
    if(!access_token) {
        return res.status(400).send("Access token is missing.");
    }

    try{
        // Make a api call to fitbit resource server to fetch the user data
        const response = await axios.get('https://api.fitbit.com/1/user/-/profile.json',
            {
                headers: {
                    "Authorization" : "Bearer " + access_token
                }
            }
        )

        const userData = response.data.user;  // Extract the user data
        
        // Send the user data as a response
        res.status(200).json({
            success: true,
            user: userData
        });

    }catch(error) {
        console.error('Error exchaning token: ', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user data",
            error: error.response ? error.response.data : error.message
        });
    };
})
// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
