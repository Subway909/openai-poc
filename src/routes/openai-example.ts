import express from "express";
import { run } from "../controllers/openai-example.js";

let router = express.Router();

router.get('/', function(req, res, next) {
  res.send(run());
});

export default router;
