import express from 'express';
import { scrapeJiji } from './Jiji';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/health', (req, res) => {
  res.send('Hello World');
});

app.get('/jiji', (req, res) => {
  scrapeJiji(req, res);
});

app.listen(port, () => {
  console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
  console.log(`🚀 Server ready at ${port}`);
});
