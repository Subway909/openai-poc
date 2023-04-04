import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from 'path';
import indexRouter from "./routes/index";
import createError from "http-errors";

const app = express();
dotenv.config(); //Reads .env file and makes it accessible via process.env

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at ${process.env.PORT}`);
});
