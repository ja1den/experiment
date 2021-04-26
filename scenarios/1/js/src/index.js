// Imports
const path = require('path');
const fs = require('fs');

// Main
async function main() {
	// Resolve Directories
	const root = path.resolve(process.cwd(), '..');

	const iPath = path.resolve(root, 'data', 'input');
	const oPath = path.resolve(root, 'data', 'js');

	// File Names
	const names = fs.readdirSync(iPath);

	// Read Files
	for (const name of names) {
		// File Content
		const read = fs.readFileSync(path.resolve(iPath, name), { encoding: 'utf8' });

		// Parse and Sort Numbers
		const numbers = read.split(/\n/).map(str => parseInt(str)).sort((a, b) => a - b);

		// Stringify Numbers
		const data = numbers.map(num => num.toString().padStart(8, '0')).join('\n');

		// Create File
		fs.writeFileSync(path.resolve(oPath, name), data);

		// Sum Numbers
		const sum = numbers.reduce((sum, num) => sum + num, 0);
		console.log(sum);
	}
}
main();
