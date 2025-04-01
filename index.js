// pages/api/proxy.js
import request from 'request';

export default function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Missing URL parameter");
    }

    // Request the content from the target URL
    request({
        url: targetUrl,
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        encoding: null,
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send("Error fetching the requested URL");
        }

        // Forward the response headers and remove 'X-Frame-Options' to allow embedding
        res.set(response.headers);
        delete response.headers['x-frame-options'];

        // Modify the response body (HTML) to replace relative URLs with full URLs for assets
        let modifiedBody = body.toString();
        modifiedBody = modifiedBody.replace(/(href="\/assets|src="\/assets)/g, (match) => {
            return match.replace('/assets', 'https://player.romantica.top/assets');
        });

        // Send the modified body to the client
        res.status(response.statusCode).send(modifiedBody);
    });
}
