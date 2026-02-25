import initApp from "./server";
import https from 'https';
import fs from 'fs';

const port = Number(process.env.PORT) || 4000;
const https_port = Number(process.env.HTTPS_PORT) || 4002;

initApp().then((app) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('development mode');
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } else {

    const prop = {
      key: fs.readFileSync('src/certs/client-key.pem'),
      cert: fs.readFileSync('src/certs/client-cert.pem')
    }
    https.createServer(prop, app).listen(https_port);
  }

});