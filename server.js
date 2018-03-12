'use strict';

const express = require('express');

// import body parser to parse json in requests
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const mongoose = require('mongoose');
// use ES6 promises instead of built-in mongoose promises
mongoose.Promise = global.Promise;

// import morgan for server logging
const morgan = require('morgan');


const app = express();

// implement the router for CRUD routes
const router = require('./router');
app.use('/blog-posts', router);

// import the PORT and DATABASE_URL variables 
const {PORT, DATABASE_URL} = require('./config.js');

// global server variable for runServer and closeServer functions
let server;

function runServer(databaseUrl, port = PORT) {

	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${PORT}`);
				resolve();
			})
				.on('error', err => {
					mongoose.disconnect();
					reject(err);
				});
		});
	});
}

function closeServer() {
	return mongoose.disconnect()
		.then(() => {
			return new Promise((resolve, reject) => {
				console.log('Closing server');
				server.close(err => {
					if (err) {
						return reject(err);
					}
					resolve();
				});
			});
		});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};



