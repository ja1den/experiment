// Import
import path from 'path';
import fs from 'fs';

import { spawnSync } from 'child_process';

import { Scenario } from '../index';

// Resolve Directories
const root = path.resolve(__dirname, '..', '..', 'scenarios', '1');

const paths = {
	src: {
		js: path.resolve(root, 'js'),
		rs: path.resolve(root, 'rs')
	},
	data: {
		input: path.resolve(root, 'data', 'input'),
		js: path.resolve(root, 'data', 'js'),
		rs: path.resolve(root, 'data', 'rs')
	}
};

// Define Scenario
const scenario: Scenario = {
	name: 'File I/O',
	call: async () => {
		console.log('aaa');

		return {
			js: {
				data: {
					duration: [],
					memory: []
				},
				bundle: 0
			},
			rs: {
				data: {
					duration: [],
					memory: []
				},
				bundle: 0
			}
		};

		/*
		// Results
		const results: ScenarioData = {
			js: { results: [], bundle: 0 },
			rs: { results: [], bundle: 0 }
		};

		// Loop through Cases
		for (const size of [10000, 100000, 1000000]) {
			// Purge Data
			fs.rmdirSync(path.resolve(path.resolve(root, 'data')), { recursive: true });

			// Make Directories
			if (!fs.existsSync(paths.data.input)) fs.mkdirSync(paths.data.input, { recursive: true });

			if (!fs.existsSync(paths.data.js)) fs.mkdirSync(paths.data.js);
			if (!fs.existsSync(paths.data.rs)) fs.mkdirSync(paths.data.rs);

			// Generate Files
			for (let i = 0; i < 10; i++) {
				const numbers: string[] = [];

				for (let j = 0; j < size; j++) {
					const number = Math.floor(Math.random() * Math.pow(10, 8));
					const string = number.toString().padStart(8, '0');

					numbers.push(string);
				}

				const data = numbers.join('\n');

				fs.writeFileSync(path.resolve(paths.data.input, i.toString()), data);
			}

			// Run Commands
			const js = spawnSync('time --format \'%e %M\' node src/index.js', { cwd: paths.src.js, shell: true });
			const rs = spawnSync('time --format \'%e %M\' cargo run --release --quiet', { cwd: paths.src.rs, shell: true });

			// Parse Results
			const split = {
				js: js.stderr?.toString().split(' '),
				rs: rs.stderr?.toString().split(' ')
			};

			// Push Results
			results.js.results.push({ duration: parseFloat(split.js[0]), memory: parseInt(split.js[1]) });
			results.rs.results.push({ duration: parseFloat(split.rs[0]), memory: parseInt(split.rs[1]) });
		}

		// Bundle Size
		const js = spawnSync('du -sb ' + paths.src.js, { cwd: __dirname, shell: true });
		const rs = spawnSync('du -sb ' + path.resolve(paths.src.rs, 'target', 'release'), { cwd: __dirname, shell: true });

		results.js.bundle = parseInt(js.stdout!.toString().split(' ')[0]);
		results.rs.bundle = parseInt(rs.stdout!.toString().split(' ')[0]);

		// Return Results
		return results;
		*/
	}
}

// Export
export default scenario;
