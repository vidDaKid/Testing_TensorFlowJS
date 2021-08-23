
// Backend server written in node js

const HTTP = require('http')
const FS = require('fs')
const URL = require('url')
// Lets you spawn a python function or otherwise in here
const spawn = require('child_process').spawn;

// Where to get saved model from
const saved_model = '../tfjs/new_model/model.json'
const saved_weights = '../tfjs/new_model/group1-shard1of1.bin'

const server = HTTP.createServer((req, res) => {
	// Set up cors users
	res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000'])

	const parsed_url = URL.parse(req.url)
	const path = parsed_url.pathname

	switch(path.toLowerCase()){
		// case '/':
			// res.end('Nothing to see here')
			// return

		case '/' || '/model.json/':
			FS.readFile(saved_model, (err, data) => {
				if(err) {
					res.writeHead(400);
					res.write("Sorry, couldn't get that data for you");
					console.log(err);
				} else {
					res.writeHead(200, {'Content-Type': 'application/json'});
					stringData = JSON.stringify(data)
					res.end(data);
					console.log('SENT MODEL DATA');
				}
			});
			return
		
		case '/group1-shard1of1.bin':
			FS.readFile(saved_weights, (err, data) => {
				if(err) {
					res.writeHead(400);
					res.write("Sorry, couldn't get that data for you");
					console.log(err);
				} else {
					res.writeHead(200, {'Content-Type': 'application/json'});
					stringData = JSON.stringify(data)
					res.end(data);
				}
			});
			return

		default:
			res.writeHead(404);
			res.write('Sorry, no page found')
			return
	}

	res.end();
}).listen(8080, () => {
	console.log('SERVER NOW LISTENING ON PORT 8080')
});
