import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import eventRoutes from './middleware/routes/events.js';
import joinRoutes from './middleware/routes/joins.js';

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({ origin: process.env.CLIENT_URL}));
app.use(express.json());
app.use(cookieParser());
eventRoutes(app);
joinRoutes(app);


await connectToMongoDB();

app.get('/', (req, res) => {
  res.send({ message: 'Server is running fine!' });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;