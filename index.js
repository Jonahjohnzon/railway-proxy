const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors()); // Allows all origins

app.get("/proxy", (req, res) => {
    let url = req.query.url; // Get URL from query parameter

    if (!url) {
        return res.status(400).send("Missing URL parameter");
    }

    request(
        {
            url: url,
            headers: {
                "Referer": "https://wlext.is/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            encoding: null // Ensures correct binary data handling (important for images & videos)
        },
        (error, response, body) => {
            if (error) {
                res.status(500).send("Error fetching the requested URL");
            } else {
                // Copy headers from the original response
                res.set(response.headers);
                res.status(response.statusCode).send(body);
            }
        }
    );
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
