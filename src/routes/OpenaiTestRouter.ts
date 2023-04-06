import express from "express";
import { run } from '../controllers/OpenaiTestController.js';

let router = express.Router();

router.get('/', async function(req, res, next) {

  let result = await run();

  if(result) {
    res.status(200);
    res.send(result);
  }
  else {
    res.status(400);
    res.send('error');
  }
});

export default router;

