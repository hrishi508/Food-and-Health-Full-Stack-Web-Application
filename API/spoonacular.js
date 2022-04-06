const { response } = require('express');
const https = require('https');
const request = require('request');
const axios = require('axios').default;
const BASE_URL = "https://api.spoonacular.com/recipes/";
const key = "13bdda95b22b4294af6b4812f0a2bbc0";

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

const Fs = require('fs')  
const Path = require('path')  

async function nutritionWidget (id) {
    try
    {
        const url = BASE_URL + id + "/nutritionWidget.png?apiKey=" + key;
        const path = Path.resolve(__dirname, '../public', 'images_nutrition', id+'.png');
        const writer = Fs.createWriteStream(path)

        const response = await axios({
          url,
          method: 'GET',
          responseType: 'stream'
        })

        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
    }
    catch (error) 
    {
      console.log("error in nutrition widget");
    }
};

async function getTaste (id) {
  try
  {
      const url = BASE_URL + id + "/tasteWidget.png?apiKey=" + key;
      const path2 = Path.resolve(__dirname, '../public', 'images_taste', id+'.png');
      const writer = Fs.createWriteStream(path2)

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })

      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
  }
  catch (error) 
  {
    console.log("error in get Taste");
  }
};

module.exports = {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste};