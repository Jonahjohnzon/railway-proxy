const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors()); // Allows all origins

// Forwards all requests through proxy
app.get("/proxy", (req, res) => {
    let url = req.query.url;

    if (!url) {
        return res.status(400).send("Missing URL parameter");
    }

    // Ensure the URL is fully qualified (handling relative URLs)
    if (!url.startsWith("http")) {
        url = "https://player.romantica.top" + url;
    }

    // Request the resource (video, JS, CSS, etc.)
    request({
        url: url,
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        encoding: null // Ensure correct handling of binary content (like images, videos, etc.)
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send("Error fetching the requested URL");
        }

        // Forward headers, ensuring MIME types are correctly passed
        res.set(response.headers);
        res.status(response.statusCode).send(body);
    });
});

// To serve other resources like images or scripts directly from the proxy server
app.use(express.static("assets"));

app.listen(3000, () => console.log("Proxy running on port 3000"));
