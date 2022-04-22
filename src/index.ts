import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/health', (req, res) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`🚀 Server ready at ${port}`);
});
