const http = require('http');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    const timestamp = new Date().toISOString();
    // Prioritize x-forwarded-for to see the real IP behind the CDN
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    console.log(`\n======================================================`);
    console.log(`[${timestamp}] Incoming Request from ${clientIp}`);
    console.log(`Method: ${req.method} | URL: ${req.url}`);
    
    console.log('Headers:');
    console.log(JSON.stringify(req.headers, null, 2));

    let bodyChunks = [];
    req.on('data', chunk => {
        bodyChunks.push(chunk);
    });

    req.on('end', () => {
        if (bodyChunks.length > 0) {
            const body = Buffer.concat(bodyChunks).toString();
            console.log('Body:');
            console.log(body);
        } else {
            console.log('Body: <empty>');
        }
        console.log(`======================================================\n`);

        // Always return a 200 OK response
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*' // Helpful for checking CORS during CDN tests
        });
        res.end('OK\n');
    });
});

server.listen(PORT, () => {
    console.log(`XHTTP CDN Tester running on port ${PORT}...`);
    console.log(`Waiting for incoming traffic...\n`);
});