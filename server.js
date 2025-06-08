// server.js
const fs = require('fs');
const https = require('https');
const next = require('next');

const app = next({ dev: false });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./ssl/private.key'),
  cert: fs.readFileSync('./ssl/certificate.crt')
};

app.prepare().then(() => {
  https.createServer(httpsOptions, (req, res) => {
    handle(req, res);
  }).listen(443, '0.0.0.0', () => {
    console.log('> Server ready on https://demo.vlu.edu.vn');
  });
});
