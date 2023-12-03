// Express documentation: https://expressjs.com/en/guide/using-template-engines.html
const express = require("express");
const path = require("path");
const app = express();

// Connection to the client
app.use(express.static(path.join(__dirname, "../client")));

// Weather updates
app.get("/api/weather", (req, res) => {
  // PLEASE READ: This is still a mock up, to enhance in Phase 2 when everything is working
  const weatherData = {
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    temperature: 15, // Example temperature
    condition: "Sunny", // Example condition
  };

  res.json(weatherData);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
