#!/usr/bin/env node
 
var lib = require('../lib/index.js');

let generate = false;
let toGenerate = "";
generateEnabled = ["component", "service", "app"];

const getProcessArgs = () => {

	return new Promise((done, error) => {

		process.argv.forEach((val) => {

			if(val === "-h" || val === '--help') {
				lib.help();
				done(val);
			}

			if(val === "generate") {
				generate = true;
			}

			if(generateEnabled.indexOf(val) !== -1 && generate) {
				console.log('------------ val', val);
				toGenerate = val;
			}

			if(generate && toGenerate != "") {
				lib.generate(toGenerate);
				done(toGenerate);
			}
		});

		error();
	});
};

function init() {

	getProcessArgs()
	.then((response) => {
		console.log(response);
	})
	.catch(() => {
		lib.help();
	});
}

init();
