import express from 'express';
import { DocumentsControllerHelper } from '../controllers/DocumentsController.js';

const router = express.Router();

router.get('/', async function(req, res) {
  const _document = new DocumentsControllerHelper();
  const documentsList = await _document.listDocuments();

  return res.status(200).send(documentsList);
});

export default router;
