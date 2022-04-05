const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require("body-parser");

const {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste} = require("./API/spoonacular");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
// return the index.html file when a GET request is made to the root path "/"
app.get("/", function (req, res) {

  res.sendFile(__dirname + "/views/index.html");
});

app.get("/cuisines", function (req, res) {

  res.sendFile(__dirname + "/views/html5up-phantom/landing.html");
});

var cuisine;
app.get("/food_item", function (req, res) {
  cuisine = req.query.cuisine;
  console.log(cuisine);
  res.sendFile(__dirname + "/views/html5up-phantom/landing.html");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});


