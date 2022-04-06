const BASE_URL = "https://gnews.io/api/v4/";
const key = "174a587f17d51b8b3cb68fb660be2a23";
const query = "food AND healthy";

function search () {
    var url = BASE_URL + "search?q=" + query + "&token=" + key;
    request.get(url, function (error, response, body) {
        const data = JSON.parse(body);
    });
};