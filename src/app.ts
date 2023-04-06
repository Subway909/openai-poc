import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path';
import {fileURLToPath} from 'url';
import indexRouter from "./routes/index.js";
import dbtestRouter from "./routes/DbtestRouter.js";
import openaiTestRouter from "./routes/OpenaiTestRouter.js";
import createError from "http-errors";

const app = express();
dotenv.config(); //Reads .env file and makes it accessible via process.env

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set static directory (js and css).
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir))

app.use('/', indexRouter);
app.use('/dbtest', dbtestRouter);
app.use('/openaiTest', openaiTestRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});

export default app;
