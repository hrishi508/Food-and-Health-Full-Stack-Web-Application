const { response } = require('express');
const https = require('https');
const request = require('request');
const axios = require('axios').default;
const BASE_URL = "https://api.spoonacular.com/recipes/";
const key = "bdee237076324d6a8f2c90d76047316d";

// function searchRecipe (cuisine, diet) {
//     var url = BASE_URL + "complexSearch?query=a&cuisine=" + cuisine + "&diet="+ diet + "&apiKey=" + key;
//     request.get(url, function (error, response, body) {
//         const data = JSON.parse(body);
//         console.log(data);
//     });
// };
async function searchRecipe(cuisine, diet) {
    try {
      var url = BASE_URL + "complexSearch?query=a&cuisine=" + cuisine + "&diet="+ diet + "&apiKey=" + key;
      const response = await axios.get(url);
    //   console.log(response.data);
      return response.data;
    } 
    catch (error) {
      console.error(error);
    }
  }

function getSimilarRecipes (id) {
    var url = BASE_URL + "recipes/" + id + "/similar?apiKey=" + key;
    request.get(url, function (error, response, body) {
        const data = JSON.parse(body);
        console.log(data[0].id);
    });
};

function recipeCard (id) {
    var url = BASE_URL + "recipes/" + id + "/card?apiKey=" + key;
    request.get(url, function (error, response, body) {
        console.log(body);
    });
};

function nutritionWidget (id) {
    var url = BASE_URL + "recipes/" + id + "/nutritionWidget.png?apiKey=" + key;
    request.get(url, function (error, response, body) {
        const data = JSON.parse(body);
    });
};

function getTaste (id) {
    var url = BASE_URL + "recipes/" + id + "/tasteWidget.json?apiKey=" + key;
    request.get(url, function (error, response, body) {
        // const data = HTML.parse(body);
        const data = body.outerHTML;
        console.log(data);
    });
};

module.exports = {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste};