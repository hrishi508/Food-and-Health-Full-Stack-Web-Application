const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require("body-parser");

const {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste} = require("./API/spoonacular");
const {search} = require("./API/gnews");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// return the index.html file when a GET request is made to the root path "/"
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/cuisines", function (req, res) {
  res.sendFile(__dirname + "/views/cuisines.html");
});

var cuisine;
app.get("/diet", function (req, res) { 
  cuisine = req.query.cuisine;
  
  res.sendFile(__dirname + "/views/diet.html");
});

var diet;
app.get("/food_item_list", function (req, res) {
  diet = req.query.diet;

  searchRecipe(cuisine, diet);

  res.sendFile(__dirname + "/views/food_item_list.html");
});

app.get("/food_item", function (req, res) {
  //item_id = req.query.item;
  item_id = 716429;

  getSimilarRecipes(item_id);
  recipeCard(item_id);
  //nutritionWidget(item_id);
  //getTaste(item_id);

  res.sendFile(__dirname + "/views/food_item.html");
});

app.get("/news", function (req, res) {

  search();

  res.sendFile(__dirname + "/views/trending_blogs.html");
});

app.get("/template", function (req, res) {

  res.sendFile(__dirname + "/views/sample_1.html");
});

app.listen(3000, function () {
  console.log("Server running on port 3000");
});


