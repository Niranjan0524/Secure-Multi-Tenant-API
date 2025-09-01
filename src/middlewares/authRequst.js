const { authenticateJWT } = require("./auth");
const { authenticateApiKey } = require("./apiKey");

// Middleware that accepts both JWT tokens and API keys
const authenticateRequest = async (req, res, next) => {
  // Check if API key is provided
  const apiKey =
    req.header("X-API-Key") ||
    req.header("Authorization")?.replace("Bearer ", "") ||
    req.query.api_key;

  if (apiKey) {
    // Use API key authentication
    return authenticateApiKey(req, res, next);
  } else {
    // Use JWT authentication
    return authenticateJWT(req, res, next);
  }
};

module.exports = {
  authenticateRequest,
};
