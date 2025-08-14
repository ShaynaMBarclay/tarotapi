import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cardRoutes from './routes/cardRoutes.js';
import readingRoutes from './routes/readingRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'https://moonandcards.netlify.app'
}));

app.use(express.json());
app.use('/tarotdeck', express.static('images'));

app.use('/cards', cardRoutes);
app.use('/reading', readingRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
