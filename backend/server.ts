import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/db';
import { router as apiRouter } from './routes/api';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Cimba Support Bot API' });
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});