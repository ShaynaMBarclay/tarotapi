import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cardRoutes from './routes/cardRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: [
     'http://localhost:5173',    // local dev
    'http://localhost:3000',    // another local dev port if used
    'https://moonandcards.netlify.app',  // old deployed frontend
    'https://lune.cards'
  ]
}));
app.use(express.json());
app.use('/tarotdeck', express.static('images'));

app.use('/cards', cardRoutes);
app.use('/reading', readingRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
