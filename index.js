import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/db.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

await connectToMongoDB();

app.get('/', (req, res) => {
  res.send({ message: 'Server is running fine!' });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;