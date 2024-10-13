const crypto = require('crypto');

// Utility function to generate a random code verifier
function generateCodeVerifier() {
    return crypto.randomBytes(32).toString('base64url');
  }
  
  // Utility function to generate a code challenge
  function generateCodeChallenge(verifier) {
    return crypto.createHash('sha256').update(verifier).digest('base64url');
  }
  

// Export the functions
module.exports = {
    generateCodeVerifier,
    generateCodeChallenge
};