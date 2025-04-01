const express = require("express");
const request = require("request");
const cors = require("cors");
const url = require("url");

const app = express();
app.use(cors()); // Allows all origins

app.get("/proxy", (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Missing URL parameter");
    }

    // Handle relative paths
    if (!targetUrl.startsWith("http")) {
        targetUrl = "https://player.romantica.top" + targetUrl;
    }

    // Check the file extension for JS, CSS, or media (to handle MIME types correctly)
    const parsedUrl = new URL(targetUrl);
    const fileExtension = parsedUrl.pathname.split('.').pop();

    request(
        {
            url: targetUrl,
            headers: {
                "Referer": "https://wlext.is/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            },
            encoding: null // Ensures binary data is handled correctly (important for images & videos)
        },
        (error, response, body) => {
            if (error) {
                return res.status(500).send("Error fetching the requested URL");
            }

            // Fix MIME type based on file extension
            if (fileExtension === "js") {
                res.set("Content-Type", "application/javascript");
            } else if (fileExtension === "css") {
                res.set("Content-Type", "text/css");
            } else if (fileExtension === "jpg" || fileExtension === "jpeg" || fileExtension === "png" || fileExtension === "gif" || fileExtension === "webp") {
                res.set("Content-Type", "image/" + fileExtension);
            } else if (fileExtension === "mp4" || fileExtension === "webm" || fileExtension === "avi") {
                res.set("Content-Type", "video/" + fileExtension);
            } else if (fileExtension === "mkv") {
                res.set("Content-Type", "video/x-matroska");
            }

            // Forward the response body and headers
            res.set(response.headers);
            res.status(response.statusCode).send(body);
        }
    );
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
