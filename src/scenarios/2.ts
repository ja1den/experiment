// Import
import path from 'path';

import { spawn, spawnSync } from 'child_process';
import axios from 'axios';

import { Scenario, ScenarioData } from '../index';

// Resolve Directories
const root = path.resolve(__dirname, '..', '..', 'scenarios', '2');

const paths = {
	src: {
		js: path.resolve(root, 'js'),
		rs: path.resolve(root, 'rs')
	}
};

// Define Scenario
const scenario: Scenario = {
	name: 'Network I/O',
	call: async () => {
		// Results
		const results: ScenarioData = {
			js: { results: [], bundle: 0 },
			rs: { results: [], bundle: 0 }
		};

		// Loop through Cases
		for (const size of [100, 1000, 10000]) {
			await Promise.all([
				new Promise<void>(async resolve => {
					// Run Command
					const js = spawn('time --format \'%e %M\' node src/index.js ' + size, { cwd: paths.src.js, shell: true });

					// Server Ready
					await new Promise(resolve => js.stdout.on('data', resolve));

					// Emit Requests
					for (let i = 0; i < size; i++) await axios.get('http://localhost:3000/');

					// Parse Results
					const split = await new Promise<string>(resolve => js.stderr.on('data', data => resolve(data.toString().trim().split(' '))));
					results.js.results.push({ duration: parseFloat(split[0]), memory: parseInt(split[1]) });

					// Resolve Promise
					resolve();
				}),
				new Promise<void>(async resolve => {
					// Run Command
					const rs = spawn('time --format \'%e %M\' cargo run --release --quiet ' + size, { cwd: paths.src.rs, shell: true });

					// Server Ready
					await new Promise(resolve => rs.stdout.on('data', resolve));

					// Emit Requests
					for (let i = 0; i < size; i++) await axios.get('http://localhost:4000').catch(() => { });

					// Parse Results
					const split = await new Promise<string>(resolve => rs.stderr.on('data', data => resolve(data.toString().trim().split(' '))));
					results.rs.results.push({ duration: parseFloat(split[0]), memory: parseInt(split[1]) });

					// Resolve Promise
					resolve();
				})
			]);
		}

		// Bundle Size
		const js = spawnSync('du -sb ' + paths.src.js, { cwd: __dirname, shell: true });
		const rs = spawnSync('du -sb ' + path.resolve(paths.src.rs, 'target', 'release'), { cwd: __dirname, shell: true });

		results.js.bundle = parseInt(js.stdout!.toString().split(' ')[0]);
		results.rs.bundle = parseInt(rs.stdout!.toString().split(' ')[0]);

		// Return Results
		return results;
	}
}

// Export
export default scenario;
