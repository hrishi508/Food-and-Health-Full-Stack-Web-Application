const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require("body-parser");
const request = require('request');
const axios = require('axios');

const {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste} = require("./API/spoonacular");
const {searchNews} = require("./API/gnews");
app.set('view engine', 'ejs');
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
app.get("/food_item_list", async function (req, res) {
  diet = req.query.diet;
  var data = await searchRecipe(cuisine, diet);
  // console.log(data);
  res.render("food_item_list", {item : data.results});
});

app.get("/food_item", async function (req, res) {
  item_id = req.query.item;
  console.log(item_id);
  // getSimilarRecipes(item_id);
  var data_recipe = await recipeCard(item_id);
  await nutritionWidget(item_id);
  // await getTaste(item_id);
  // var data_taste = await getTaste(item_id);
  // console.log(data_nutrition);
  // console.log(data_recipe);
  // console.log(data_taste);

  res.render("food_item", {url_recipe : data_recipe.url, id:item_id});
  // res.render("food_item_list", {url_recipe : data_recipe.url, url_nutrition : data_nutrition.url, url_taste : data_taste.url});
});

app.get("/news", async function (req, res) {

  var data = await searchNews();
  // console.log(data);
  res.render("news", {item : data});
});

app.get("/template", function (req, res) {

  res.sendFile(__dirname + "/views/sample_1.html");
});

app.get("/maintenance", function (req, res) {
  res.sendFile(__dirname + "/views/maintenance.html")
})

app.listen(process.env.PORT||3000, function () {
  console.log("Server running on port 3000");
});


