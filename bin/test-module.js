#!/usr/bin/env node
 
var lib = require('../lib/index.js');

let generate = false;
let toGenerate = "";
generateEnabled = ["component", "service"];

const getProcessArgs = () => {

	return new Promise((done, error) => {

		process.argv.forEach((val) => {

			if(val === "-h" || val === '--help') {
				lib.help();
				done();
			}

			if(val === "generate") {
				generate = true;
			}

			if(generateEnabled.indexOf(val) !== -1 && generate) {
				toGenerate = val;
			}

			if(generate && toGenerate != "") {
				lib.generate(toGenerate);
				done();
			}
		});

		error();
	});
};

function init() {

	getProcessArgs()
	.then()
	.catch(() => {
		lib.help();
	});
}

init();
