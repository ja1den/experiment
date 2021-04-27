// Import
import path from 'path';
import fs from 'fs';

import { spawnSync } from 'child_process';

import 'colors';

// Types
export interface Scenario {
	name: string;
	call: () => Promise<ScenarioData>;
}

export interface ScenarioData {
	js: {
		results: Result[];
		bundle: number;
	};
	rs: {
		results: Result[];
		bundle: number;
	};
}

export interface Result {
	duration: number;
	memory: number;
}

// Main
async function main() {
	// Read Names
	const names = fs.readdirSync(path.resolve(__dirname, 'scenarios'));

	// Node Binary
	const spawn = spawnSync('du -sb $(awk -F \' \' \'{print $2}\' <<< $(whereis node))', { shell: '/bin/bash' });
	const size = parseInt(spawn.stdout.toString().match(/\d+/)![0]);

	// Loop through Names
	for (const name of names) {
		// Import Scenario
		const { default: scenario }: { default: Scenario } = await import(path.resolve(__dirname, 'scenarios', name));

		// Log Name
		if (scenario.name === 'File I/O') continue;

		console.log((' ' + scenario.name + ' ').black.bgGreen + '\n');

		// Run Scenario
		const data = await scenario.call();

		data.js.bundle += size;

		// Log Data
		console.log(JSON.stringify(data) + '\n');
	}
}
main();
