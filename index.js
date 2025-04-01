const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors()); // Allows all origins

app.get("/proxy", (req, res) => {
    let videoUrl = req.query.url; // Get URL from query parameter

    if (!videoUrl) {
        return res.status(400).send("Missing URL parameter");
    }

    request({
        url: videoUrl,
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    }, (error, response, body) => {
        if (error) {
            res.status(500).send("Error fetching the requested URL");
        } else {
            // Copy headers to ensure correct MIME types
            res.set(response.headers);
            res.send(body);
        }
    });
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
