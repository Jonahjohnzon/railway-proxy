import axios from 'axios';

export default function handler(req, res) {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send("Missing URL parameter");
    }

    axios.get(targetUrl, {
        headers: {
            "Referer": "https://wlext.is/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        },
        responseType: 'arraybuffer'
    })
    .then((response) => {
        // Forward headers
        res.set(response.headers);
        
        // Modify the response body if needed (e.g., fix relative URLs)
        let body = response.data.toString();
        body = body.replace(/(href="\/assets|src="\/assets)/g, (match) => {
            return match.replace('/assets', 'https://player.romantica.top/assets');
        });

        // Send the modified body to the client
        res.status(200).send(body);
    })
    .catch((error) => {
        res.status(500).send("Error fetching the requested URL");
    });
}
