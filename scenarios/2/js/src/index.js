// Import
const http = require('http');

// Main Function
async function main() {
	// Read Maximum
	if (process.argv[2] === undefined) {
		console.error('argument \'max\' must be defined');
		process.exit(1);
	}

	if (!Number.isInteger(parseInt(process.argv[2]))) {
		console.error('argument \'max\' must be an integer');
		process.exit(1);
	}

	// Initialise Count
	let max = parseInt(process.argv[2]);
	let i = 0;

	// Handle Requests
	const handleRequest = (_req, res) => {
		// Increment
		i = i + 1;

		// Send Response
		res.end();

		// Check Maximum
		if (i === max) process.exit(0);
	}

	// Listen on 3000
	http.createServer(handleRequest).listen(3000);

	// Log
	console.log('http://localhost:3000');
}
main();
