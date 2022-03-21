const Koa = require('koa');
const app = new Koa();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('koa2-cors');
const bodyparser = require('koa-bodyparser');
const image = require('./image');

app.use(cors());
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));

app.use(image.routes(), image.allowedMethods());

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
