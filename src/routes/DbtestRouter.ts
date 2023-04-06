import client from '../controllers/PgController.js';
import express from "express";

let router = express.Router();

router.get('/', async function(req, res, next) {
  //let rows = await client.query('SELECT * FROM DOCUMENTS');

  let rows = await client.query('SELECT * FROM documents WHERE title = $1', ['test']);


  // console.log(client);
  res.send(rows.rows);
});

export default router;
