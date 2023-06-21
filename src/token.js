const jwt = require("jsonwebtoken");
const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const pem = "key.pem";
const app_id = "314634";

function generateJWT() {
  // Open PEM
  const signingKey = fs.readFileSync(pem);

  const payload = {
    // Issued at time
    iat: Math.floor(Date.now() / 1000),
    // JWT expiration time (5 minutes maximum)
    exp: Math.floor(Date.now() / 1000) + 300, // Set to 5 minutes (300 seconds)
    // GitHub App's identifier
    iss: app_id,
  };

  // Create JWT
  const encoded_jwt = jwt.sign(payload, signingKey, { algorithm: "RS256" });

  return encoded_jwt;
}

// Define a route to generate the JWT
app.get("/generate-jwt", (req, res) => {
  const jwtToken = generateJWT();

  try {
    // Open PEM
    const signingKey = fs.readFileSync(pem);

    // Verify and decode the JWT token
    const decodedJwt = jwt.verify(jwtToken, signingKey, {
      algorithms: ["RS256"],
    });

    res.json({ token: jwtToken, decoded: decodedJwt });
  } catch (error) {
    console.error("Error decoding JWT:", error);
    res.status(500).json({ error: "Error decoding JWT" });
  }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
