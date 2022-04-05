const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.post("/", function (req, res) {
    const firstName = req.body.first_name;
    const secondName = req.body.second_name;
    const email = req.body.email;

    console.log(firstName);
    console.log(secondName);
    console.log(email);

    var data = {
        members :[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: secondName,
                    EMAIL: email
                }
            }
        ]
    };
    

    const jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "sushant:bfb0fe5f561797839a00ff98f13ff386-us20"
    };

    var r =  https.request("https://us20.api.mailchimp.com/3.0/lists/2d8ab72cd5", options, function (response) 
    {
        if(response.statusCode !== 200)
        {
            res.sendFile(__dirname + "/failure.html");
        }

        else 
        {
            res.sendFile(__dirname + "/success.html");
        }

        response.on("data", function (data) 
        {
            // console.log(JSON.parse(data));
        });
    });
    r.write(jsonData);
    r.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});


app.listen(3000, function() {
    console.log("Server running on port 3000");
});
