const HTTP = require('http')
const FS = require('fs')
const spawn = require('child_process').spawn;

/* 
 * This server is hosted on localhost:8080
 * It take
*/
const server = HTTP.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", ["http://localhost:3000"]);
	// console.log(res.getHeader('Access-Control-Allow-Origin'))
	res.writeHead(200, {"Content-Type":"application/json"});
	// res.write(JSON.stringify('testing'))
	// console.log('[GET] Someone just sent a get request')
	 let pythonProcess
	if (req.method=='POST') {
		let data = ''
		req.on('data', chunk => {
			data += chunk
		})
		req.on('end', () => {
			let parsedData = JSON.parse(data)
			// console.log(data)
			parsedData = JSON.stringify(parsedData)
			pythonProcess = spawn(
				'python3',
				['./script.py', parsedData]
			)
			pythonData = ''
			// Get data on success
			pythonProcess.stdout.on('data', chunk => {
				pythonData += chunk
			})
			pythonProcess.stderr.on('data', err => {
				pythonData += err
			})
			pythonProcess.stdout.on('close', () => {
				// pythonData = JSON.parse(pythonData)
				console.log(pythonData)
			})
			// console.log(pythonData)
			res.end()
		})
	}
})

server.listen(8080, () => {
	console.log('Server now listening on port 8080')
})
