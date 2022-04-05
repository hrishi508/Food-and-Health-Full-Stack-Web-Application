const { response } = require('express');
const https = require('https');
const request = require('request');
const BASE_URL = "https://api.spoonacular.com/recipes/";
const key = "13bdda95b22b4294af6b4812f0a2bbc0";

function searchRecipe (cuisine, diet) {
    var url = BASE_URL + "complexSearch?query=a&cuisine=" + cuisine + "&diet="+ diet + "&apiKey=" + key;
    request.get(url, function (error, response, body) {
        const data = JSON.parse(body);
        console.log(data.results[0].title);
    });
};


const getSimilarRecipes = async (http, {id}) => {
    const config = {
        method: "get",
        url : `${BASE_URL}/recipes/${id}/similar?apiKey=${key}`,
    };
    return http(config).then((res) => res.data);
};

const recipeCard = async (http, {id}) => {
    const config = {
        method: "get",
        url : `${BASE_URL}/recipes/${id}/card?apiKey=${key}`,
    };
    return http(config).then((res) => res.data);
};

const nutritionWidget = async (http, {id}) => {
    const config = {
        method: "get",
        url : `${BASE_URL}/recipes/${id}/nutritionWidget.png?apiKey=${key}`,
    };
    return http(config).then((res) => res.data);
};

const getTaste = async (http, {id}) => {
    const config = {
        method: "get",
        url : `${BASE_URL}/recipes/${id}/tasteWidget.json?apiKey=${key}`,
    };
    return http(config).then((res) => res.data);
};

module.exports = {searchRecipe, getSimilarRecipes, recipeCard, nutritionWidget, getTaste};