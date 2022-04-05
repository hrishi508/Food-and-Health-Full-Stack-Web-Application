
const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.post("/", function(req, res) {
    var c = req.body.city;
    var apiKey = "0209574f16aa32bb9e8d52428376ed6b";
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + c + "&appid=" + apiKey + "&units=metric";
    https.get(url, function (response) {

        // taken from the docs
        response.on("data", function (data) {
            // to parse JSON data
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<p>The weather is " + description +" </p>");
            res.write("<h1>The temperature in "+c+" is "+temp+"degrees Celcius</h1>");
            res.write("<img src="+imageURL + ">");
            res.send();
        });
    });

});

app.get("/", function (req, res) {

    res.sendFile(__dirname + "/index.html");
});


app.listen(3000, function () {
    console.log("Server running on port 3000");
});