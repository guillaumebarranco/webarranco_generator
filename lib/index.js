const prompt = require('prompt');

class Webarranco {

	constructor() {

	}

	help() {
		console.log('help');
	}

	generate(element) {

		switch(element) {
			case "component": {
				this.generateComponent();
			}
		}
	}

	generateComponent() {
		prompt.start();

		prompt.get(['component'], function (err, result) {

			if (err) console.log(err);

			console.log("Processing component generation : " + result.component);
		});
	}
}

module.exports = new Webarranco();
