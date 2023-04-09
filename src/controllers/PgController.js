"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
var dotenv_expand_1 = require("dotenv-expand");
var myEnv = dotenv_1.default.config();
dotenv_expand_1.default.expand(myEnv);
var database_url = process.env.DATABASE_URL;
var client = new pg_1.default.Client(database_url);
client.connect(function (err) {
    if (err) {
        console.error('connection error', err.stack);
    }
    else {
        console.log('connected');
    }
});
exports.default = client;
