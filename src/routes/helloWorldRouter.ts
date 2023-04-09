import express from "express";

const router = express.Router();

router.get('/', function(req, res, next) {
  const msg: string = 'Hello World!';
  res.send(msg);
});


export default router;
