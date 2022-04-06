const { response } = require('express');
const https = require('https');
const request = require('request');
const axios = require('axios').default;
const BASE_URL = "https://api.spoonacular.com/recipes/";
const key = "bdee237076324d6a8f2c90d76047316d";

function getSimilarRecipes (id) {
    var url = BASE_URL + "recipes/" + id + "/similar?apiKey=" + key;
    request.get(url, function (error, response, body) {
        const data = JSON.parse(body);
        console.log(data[0].id);
    });
};

async function searchRecipe(cuisine, diet) {
    try 
    {
      var url = BASE_URL + "complexSearch?query=a&cuisine=" + cuisine + "&diet="+ diet + "&apiKey=" + key;
      const response = await axios.get(url);
      return response.data;
    } 
    catch (error) 
    {
      console.error(error);
    }
};

async function recipeCard (id) {
    try
    { 
      var url = BASE_URL + id + "/card?apiKey=" + key;
      const response = await axios.get(url);
      return response.data;
    }
    catch (error) 
    {
      console.error(error);
    }
};

async function nutritionWidget (id) {
    try
    {
        var url = BASE_URL + id + "/nutritionWidget.png?apiKey=" + key;
        const resposne = await axios.get(url);
        return response.data;
    }
    catch (error) 
    {
      console.error(error);
    }
};

async function getTaste (id) {
    try
    {
        var url = BASE_URL + id + "/tasteWidget.png?apiKey=" + key;
        const resposne = await axios.get(url);
        return response.data;
    }
    catch (error) 
    {
      console.error(error);
    }
};

module.exports = {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste};