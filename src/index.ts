// Import
import path from 'path';
import fs from 'fs';

import { spawnSync } from 'child_process';
import readline from 'readline';

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

		// Scenario Name
		console.log((' ' + scenario.name + ' ').black.bgGreen + '\n');

		// Loading
		let step = 1;

		const loadInterval = setInterval(() => {
			readline.cursorTo(process.stdout, 0);
			process.stdout.write('.'.repeat(step++ % 4).padEnd(3, ' ').cyan);
		}, 400);

		// Run Scenario
		const data = await scenario.call();

		data.js.bundle += size;

		// Loading
		readline.cursorTo(process.stdout, 0);
		clearInterval(loadInterval);

		// Table Data
		const columns: ([string, (string | number)[]])[] = [];

		columns.push(['Language', ['JavaScript', 'Rust']]);

		for (let i = 0; i < Math.max(data.js.results.length, data.rs.results.length); i++) {
			columns.push(['T' + (i + 1) + ' (sec)', [data.js.results[i]?.duration ?? '', data.rs.results[i]?.duration ?? '']]);
			columns.push(['M' + (i + 1) + ' (kB)', [data.js.results[i]?.memory ?? '', data.rs.results[i]?.memory ?? '']]);
		}

		columns.push(['Bundle (B)', [data.js.bundle, data.rs.bundle]]);

		// Parse Data
		const parsed: string[][] = [];

		for (const column of columns) {
			// Length
			const length = column[1].reduce((length: number, entry) => Math.max(entry.toString().length, length), Math.max(column[0].length, 8));

			// Title
			parsed[0] = [...(parsed[0] ?? []), column[0].padEnd(length, ' ')];
			parsed[1] = [...(parsed[1] ?? []), '-'.repeat(length)];

			// Entries
			for (let i = 0; i < column[1].length; i++) {
				parsed[i + 2] = [...(parsed[i + 2] ?? []), !isNaN(parseInt(column[1][i].toString()))
					? column[1][i].toString().padEnd(length, ' ').yellow
					: column[1][i].toString().padEnd(length, ' ')
				];
			}
		}

		// Log Table
		for (let i = 0; i < parsed.length; i++) console.log('| ' + parsed[i].join(' | ') + ' |');

		// Log Newline
		if (name !== names[names.length - 1]) console.log('');
	}
}
main();
