import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  const msg = 'Hello World!';
  res.send(msg);
});


export default router;
