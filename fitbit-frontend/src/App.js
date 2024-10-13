import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Home from './Home';

const App = () => {


  return (
    <Router>
      <div>
        <Routes>
          {/* Home Route - Authorization Button */}
          <Route path="/" element={<Home />} exact/>

          {/* Route for Landing Page */}
          <Route path="/landing-page" element={<LandingPage />} exact/>
          
        </Routes>
      </div>
    </Router>
    
  );
};

export default App;
