const express = require("express");
const request = require("request");
const cors = require("cors");

const app = express();
app.use(cors()); // Allow all origins

app.get("/proxy", (req, res) => {
    const videoUrl = "https://player.romantica.top/v/g4knZL1BFNwm/";

    request({
        url: videoUrl,
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    }).pipe(res);
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
