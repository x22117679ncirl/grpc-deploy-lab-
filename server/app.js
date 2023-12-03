// Express documentation: https://expressjs.com/en/guide/using-template-engines.html
const express = require("express");
const path = require("path");
const app = express();

// Connection to the client
app.use(express.static(path.join(__dirname, "../client")));

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
