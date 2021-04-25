// Import
import path from 'path';
import fs from 'fs';

import { spawnSync } from 'child_process';

import 'colors';

// Resolve Directories
const root = path.resolve(__dirname, '..', 'data');

const oPath = path.resolve(root, 'input');

const jPath = path.resolve(root, 'js');
const rPath = path.resolve(root, 'rs');

// Scenarios
const scenarios: Function[] = [
	async () => {
		// Log
		console.log(' Scenario 1 '.black.bgGreen + '\n');

		// Reset Data
		if (fs.existsSync(root)) fs.rmdirSync(path.resolve(), { recursive: true });

		// Make Directories
		if (!fs.existsSync(oPath)) fs.mkdirSync(oPath, { recursive: true });

		if (!fs.existsSync(jPath)) fs.mkdirSync(jPath, { recursive: true });
		if (!fs.existsSync(rPath)) fs.mkdirSync(rPath, { recursive: true });

		// Generate Files
		for (let i = 0; i < 10; i++) {
			const numbers: string[] = [];

			for (let j = 0; j < 1000000; j++) {
				const number = Math.floor(Math.random() * Math.pow(10, 8));
				const string = number.toString().padStart(8, '0');

				numbers.push(string);
			}

			const data = numbers.join('\n');

			fs.writeFileSync(path.resolve(oPath, i.toString()), data);
		}

		// JavaScript
		const js = spawnSync('time --format \'T: %e s\nM: %M kB\' node src/index.js', { cwd: path.resolve(__dirname, '..', 'scenarios', '1', 'js'), shell: true });

		console.log('stdout'.green + '\n');
		console.log(js.stdout?.toString());

		console.log('stderr'.red + '\n');
		console.log(js.stderr?.toString());

		// Rust
		const rs = spawnSync('time --format \'T: %e s\nM: %M kB\' cargo run --release --quiet', { cwd: path.resolve(__dirname, '..', 'scenarios', '1', 'rs'), shell: true });

		console.log('stdout'.green + '\n');
		console.log(rs.stdout?.toString());

		console.log('stderr'.red + '\n');
		console.log(rs.stderr?.toString());
	}
];

// Main
async function main() {
	// Purge Data
	fs.rmdirSync(path.resolve(__dirname, '..', 'data'), { recursive: true });

	// Run Scenarios
	for (const scenario of scenarios) await scenario();
}
main();
