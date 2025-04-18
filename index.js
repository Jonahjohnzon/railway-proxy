const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: 'https://your-allowed-origin.com', // Replace with the allowed origin
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get("/proxy", (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Missing URL parameter");
    }
    console.log(targetUrl)
    // Ensure the URL starts with "https://"
    if (!targetUrl.startsWith("http")) {
        targetUrl = "https://player.romantica.top" + targetUrl;
    }

    // Request the content (HTML, JS, CSS, etc.)
    request({
        url: targetUrl,
        headers: {
          "Referer": "https://wlext.is/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/javascript, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest"
        },
        encoding: null, // Handle binary content (images, videos)
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send("Error fetching the requested URL");
        }

        // Forward headers
        res.set(response.headers);

        // Check if it's HTML content
        if (response.headers["content-type"].includes("html")) {
            body = body.toString();

            // Modify HTML to fix relative URLs for assets like CSS, JS, and images
            body = body.replace(/(href="\/assets|src="\/assets)/g, (match) => {
                return match.replace('/assets', 'https://player.romantica.top/assets');
            });

            // Fix base URL paths for all resources
            body = body.replace(/(href="\/)/g, (match) => {
                return match.replace('/', 'https://player.romantica.top');
            });
            body = body.replace(/(src="\/)/g, (match) => {
                return match.replace('/', 'https://player.romantica.top');
            });

            res.setHeader("Content-Type", "text/html; charset=utf-8");
        } else if (response.headers["content-type"].includes("javascript")) {
            // Forward JavaScript content correctly
            res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        } else if (response.headers["content-type"].includes("css")) {
            // Forward CSS content correctly
            res.setHeader("Content-Type", "text/css; charset=utf-8");
        }

        // Send the body of the request (video, CSS, JS, etc.)
        res.status(response.statusCode).send(body);
    });
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
