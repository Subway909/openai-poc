import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path';
import createError from "http-errors";
import indexRouter from "./routes/helloWorldRouter.js";
import dbtestRouter from "./routes/dbtestRouter.js";
import openaiTestRouter from "./routes/openaiTestRouter.js";
import uploadContentRouter from "./routes/uploadContentRouter.js";

const app = express();
dotenv.config(); //Reads .env file and makes it accessible via process.env

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.resolve('./public')));

// routes
app.use('/', indexRouter);
app.use('/dbtest', dbtestRouter);
app.use('/openaiTest', openaiTestRouter);
app.use('/upload', uploadContentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});

export default app;
