// Express documentation: https://expressjs.com/en/guide/using-template-engines.html
const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.set("views", __dirname + "/ejs");

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
