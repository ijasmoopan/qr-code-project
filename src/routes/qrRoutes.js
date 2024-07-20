import express from 'express';
import createQR from '../controllers/createQRController.js';
import readQR from '../controllers/readQRController.js';

const router = express.Router();

router.get('/qr/create/:email', createQR);
router.get('/qr/read/:email', readQR);

router.get('/', (req, res) => {
  res.status(200).json({ response: 'Server is up and running!' });
});

export default router;
