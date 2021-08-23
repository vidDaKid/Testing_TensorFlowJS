// Backend server written in node js

const HTTP = require('http')
const FS = require('fs')
const URL = require('url')
// Lets you spawn a python function or otherwise in here
const spawn = require('child_process').spawn;

const server = HTTP.createServer((req, res) => {
	// Set up cors users
	res.setHeader('Access-Control-Allow-Origin', ['http://localhost:3000'])

	const parsed_url = URL.parse(req.url)
	const path = parsed_url.pathname

	switch(path.toLowerCase()){
		case '/':
			FS.readFile('../tfjs/saved_model/model.json', (err, data) => {
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
		
		/*
		 * This endpoint only accepts a post reques with one parameter: 'coordinates'
		 * @param coordinates // json formatted string containing the coordinates of the drawing
		*/
		case '/getarray/':
			if(req.method!='POST') {
				console.log('This endpoint only accepts POST requests')
				return
			}
			// Get body by reading the incominf stream using req.on('data') & req.on('end')
			let data = ''
			req.on('data', chunk => {
				data += chunk
			})
			req.on('end', () => {
				data = JSON.parse(data)
				data = JSON.stringify(data)
				const pythonProcess = spawn(
					'python3',
					['./script.py', data]
				)
				// Get the outputted data or err from the python script
				pythonProcess.stdout.on('data', data => {
					// process the data to remove the '\n' at the end of the data
					// const processedData = JSON.parse(data)
					// const parsedData = JSON.parse(processedData).input
					// const stringData = JSON.stringify(parsedData)
					res.write(data);
				})

				pythonProcess.stderr.on('data', err => {
					// res.writeHead(400);
					console.log('error in python data transfer//line 61 server.js')
					res.write(err);
				})
				pythonProcess.on('close', (code) => {
					// res.writeHead(200, {'Content-Type': 'application/json'})
					console.log(`Python process exited with code: ${code}`)
					res.end();
				})
				
				// try {
					// pythonData = JSON.parse(pythonData)
					// const input = pythonData.input
					// console.log(input)
				// } catch(err) {
					// console.log('ERROR' + err.toString())
				// }
				// console.log(input)
				// res.end();
			})
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
