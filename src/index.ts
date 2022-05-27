import express from 'express';
import { scrapeJiji } from './Jiji';
import { scrapeMainichi } from './Mainichi';
import { scrapeReuters } from './Reuters';
require('dotenv').config();

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/health', (req, res) => {
  res.send('Hello World');
});

app.get('/jiji', async (req, res) => {
  await scrapeJiji(req, res);
});

app.get('/mainichi', async (req, res) => {
  await scrapeMainichi(req, res);
});

app.get('/reuters', async (req, res) => {
  await scrapeReuters(req, res);
});

app.listen(port, () => {
  console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
  console.log(`🚀 Server ready at ${port}`);
});
