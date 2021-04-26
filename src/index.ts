// Import
import path from 'path';
import fs from 'fs';

import 'colors';

// Types
export interface Scenario {
	name: string;
	call: (sizes: number[]) => Promise<ScenarioData>;
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
	// Define Sizes
	const sizes = [10000, 100000, 1000000];

	// Read Names
	const names = fs.readdirSync(path.resolve(__dirname, 'scenarios'));

	// Loop through Names
	for (const name of names) {
		// Import Scenario
		const { default: scenario }: { default: Scenario } = await import(path.resolve(__dirname, 'scenarios', name));

		// Log Name
		console.log((' ' + scenario.name + ' ').black.bgGreen + '\n');

		// Run Scenario
		const data = await scenario.call(sizes);

		// Log Data
		console.log(data);
	}
}
main();
