import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import env from 'dotenv';
import routes from './routes/qrRoutes.js';

const app = express();
env.config();

app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
