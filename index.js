const express = require("express");
const request = require("request");
const cors = require("cors");
const url = require("url");

const app = express();
app.use(cors()); // Allows all origins

// Proxy requests
app.get("/proxy", (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Missing URL parameter");
    }

    // Ensure the URL starts with "https://"
    if (!targetUrl.startsWith("http")) {
        targetUrl = "https://player.romantica.top" + targetUrl;
    }

    // Request the content (HTML, JS, CSS, etc.)
    request({
        url: targetUrl,
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        encoding: null, // Handle binary content (images, videos)
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send("Error fetching the requested URL");
        }

        // Forward headers
        res.set(response.headers);

        // Check if it's an HTML page (e.g., main page that links to assets like CSS/JS)
        if (response.headers["content-type"].includes("html")) {
            // Modify HTML to fix relative URLs for assets like CSS, JS, and images
            body = body.toString().replace(/(href="\/assets|src="\/assets)/g, (match) => {
                return match.replace('/assets', 'https://player.romantica.top/assets');
            });
        }

        // Send the body of the request (video, CSS, JS, etc.)
        res.status(response.statusCode).send(body);
    });
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
