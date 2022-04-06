const BASE_URL = "https://gnews.io/api/v4/";
const key = "b19e9d586acf7acd07214dd58e2dd41f";
const query = "food AND healthy";
const axios = require('axios').default;

async function searchNews () {
    try
    {
        var url = BASE_URL + "search?q=" + query + "&token=" + key;
        const response = await axios.get(url);
        return response.data;
    }
    catch (error) 
    {
      console.error(error);
    }
};

module.exports = {searchNews};
