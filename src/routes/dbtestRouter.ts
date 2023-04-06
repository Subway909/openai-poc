import client from '../controllers/PgController.js';
import express from "express";

let router = express.Router();

router.get('/', async function(req, res, next) {
  let rows = await client.query('SELECT * FROM DOCUMENTS');

  console.log(client);
  res.send(rows);
});

export default router;
