const BASE_URL = "https://gnews.io/api/v4/";
const key = "174a587f17d51b8b3cb68fb660be2a23";
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
