import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [accessToken, setAccessToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [err, setErr] = useState(null);
    const navigate = useNavigate();
    const [viewMore, setViewMore] = useState(false);

  // Clean up the URL (removing any unwanted fragments)
  useEffect(() => {
    // Parse the access token from the URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      setAccessToken(token);

      // Clean up the URL (remove access_token param and unwanted fragments)
      // origin --> localhost:3000, pathname --> /landingPage
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState(null, null, newUrl); // Replace the URL without query params or fragments
    }
  }, []);


  const goToHome = () => {
    navigate('/');
  }


  const fetchPersonData = async () => {
    try{
        const response = await axios.post(`http://localhost:4000/api/fetchData`,
            {
                access_token: accessToken
            }
        );
        console.log("user data response: ", response.data.user);
        setUserData(response.data.user);
    }
    catch(error) {
        console.log("Failed to fetch data");
        setErr("Failed to fetch user data with error: " + error)
    }
  }

  const handleViewDetails = () => {
    setViewMore(true);
  }

  const handleHideDetails = () => {
    setViewMore(false);
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='text-center p-10 bg-white rounded-lg shadow-lg'>
            {accessToken ? 
                <>
                    <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome!</h1>
                    <p className="text-gray-600 mb-4">You have successfully authorized to Fitbit.</p>
                    <button className='mt-4 px-4 py-2 mb-4 bg-green-300 rounded-md hover:bg-green-200' onClick={fetchPersonData}>Click here to view data</button>
                    <p className="text-gray-500"></p>
                    {
                        userData ? 
                        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
                            <div className="flex justify-center mb-4">
                                <img
                                    src={userData.avatar150}
                                    alt={userData.displayName}
                                    className="rounded-full border border-gray-300"
                                />
                                </div>
                                <h1 className="text-xl font-semibold text-center mb-2">{userData.fullName}</h1>
                                <p className="text-center text-gray-600">{userData.displayName} ({userData.age} years old)</p>
                                
                                <div className="mt-4">
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Height:</span>
                                    <span>{parseInt(userData.height)} cm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Weight:</span>
                                    <span>{userData.weight} kg</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Gender:</span>
                                    <span>{userData.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Timezone:</span>
                                    <span>{userData.timezone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-gray-700">Member Since:</span>
                                    <span>{new Date(userData.memberSince).toLocaleDateString()}</span>
                                </div>
                                {
                                    !viewMore ?
                                    <>
                                        <button 
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                                            onClick={handleViewDetails}  // View more details button
                                        >View more</button>
                                    </> : 
                                    <>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Average Daily Steps:</span>
                                            <span>{userData.averageDailySteps}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Sleep Tracking:</span>
                                            <span>{userData.sleepTracking}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Stride Length Running:</span>
                                            <span>{userData.strideLengthRunning}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-700">Stride Length Walking:</span>
                                            <span>{userData.strideLengthWalking}</span>
                                        </div>
                                        <button 
                                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg"
                                            onClick={handleHideDetails}  // View more details button
                                        >Hide</button>
                                    </>
                                }
                                
                            </div>
                        </div>
                        : 
                            err ? 
                                <p>Failed to fetch: {err}</p>
                            : 
                                ""
                    }
                </>
                : 
                <>
                    <h1 className="text-4xl font-bold text-red-700 mb-4">Welcome!</h1>
                    <p className="text-gray-600 mb-4">"Cannot authorize to fitbit".</p>
                </>
                 }
            <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 transition-all"
              onClick={goToHome}>
                Go To Home
            </button>
        </div>
    </div>
  );
};

export default LandingPage;