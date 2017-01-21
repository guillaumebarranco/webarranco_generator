const fs = require('fs');
const mkdirp = require('mkdirp');

const prompt = require('prompt');

class UtilsClass {

	throwError(err) {
		console.log('err', err);
	}

	getFile(file, callback) {

		fs.readFile('./lib/'+file, 'utf-8', function(err, data) {
			callback(data);
		});
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

		return new Promise((resolve, reject) => {

			let code = {};

			this.getFile('ng2/component/ts', (ts) => {
				code.ts = ts.replace(/{name}/g, name);

				this.getFile('ng2/component/html', (html) => {
					code.html = html.replace(/{name}/g, name);

					this.getFile('ng2/component/scss', (scss) => {
						code.scss = scss.replace(/{name}/g, name);

						resolve(code);
					});
				});
			})
		});
	}

	getServiceCode(name) {

		return new Promise((resolve, reject) => {

			let code = {};

			this.getFile('ng2/service/ts', (ts) => {
				code.ts = ts.replace(/{name}/g, name);

				resolve(code);
			})
		});
	}

	generateComponent() {

		this.prompt('component').then((response) => {

			this.getComponentCode(response).then((code) => {

				mkdirp('./'+response, (err) => {
					if(err) return this.throwError(err);

					fs.writeFile('./'+response+'/'+response+'.component.ts', code.ts, (err) => {
						if(err) return this.throwError(err);

						fs.writeFile('./'+response+'/'+response+'.component.html', code.html, (err) => {
							if(err) return this.throwError(err);

							fs.writeFile('./'+response+'/'+response+'.component.scss', code.scss, (err) => {
								if(err) return this.throwError(err);
							});
						});
					});
				});
			});
		});
	}

	generateService() {
		this.prompt('service').then((response) => {

			this.getServiceCode(response).then((code) => {

				mkdirp('./'+response, (err) => {
					if(err) return this.throwError(err);

					fs.writeFile('./'+response+'/'+response+'.service.ts', code.ts, (err) => {

					});
				});
			});
		});
	}
}

const utils = new UtilsClass(); 

class Webarranco {

	constructor() {}

	help() {

		utils.getFile('help', function(data) {
			console.log(data);
		});
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
