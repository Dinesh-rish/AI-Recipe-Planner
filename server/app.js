import express from 'express';

const app = express();
app.get('/', (_req, res) => res.send('OK'));
app.listen(4000, () => console.log('Test listening on http://localhost:4000'));
