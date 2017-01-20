const fs = require('fs');
const mkdirp = require('mkdirp');

const prompt = require('prompt');

class UtilsClass {

	throwError(err) {
		console.log('err', err);
	}

	prompt(element) {

		prompt.start();

		return new Promise((resolve, reject) => {

			prompt.get([element], function (err, result) {

				if (err) console.log('err', err);

				console.log("Processing " + element + " generation : " + result[element]);

				resolve(result[element]);
			});
		});
	}

	getComponentCode(name) {

		return `import { Component } from '@angular/core';

		@Component({
			selector: '${name}',
			templateUrl: './${name}.component.html',
			styles: './${name}.component.scss'
		})

		export class ${name}Component {

			constructor() {
			}
		}`;
	}

	getComponentHtml(name) {
		return `<div>Welcome on your ${name} component</div>`;
	}

	getComponentScss(name) {

		return `img {
			margin: 0 auto;
		    width: 80%;
		    display: block;
		}`;
	}

	generateComponent() {

		this.prompt('component').then((response) => {

			mkdirp('./'+response, (err) => {

				if(err) return this.throwError(err);

				fs.writeFile('./'+response+'/'+response+'.component.js', this.getComponentCode(response), (err) => {

					if(err) return this.throwError(err);

					fs.writeFile('./'+response+'/'+response+'.component.html', this.getComponentHtml(response), (err) => {

						if(err) return this.throwError(err);

						fs.writeFile('./'+response+'/'+response+'.component.scss', this.getComponentScss(response), (err) => {

							if(err) return this.throwError(err);
						});
					});
				});
			});
		});
	}

	generateService() {
		this.prompt('service').then((response) => {
			console.log(response);
		});
	}
}

const utils = new UtilsClass(); 

class Webarranco {

	constructor() {}

	help() {
		console.log('help');
	}

	generate(element) {

		switch(element) {

			case "component": {
				utils.generateComponent();
				break;
			}

			case "service": {
				utils.generateService();
				break;
			}

			default: {
				break;
			}
		}
	}
}

module.exports = new Webarranco();
