const fs = require('fs');
const mkdirp = require('mkdirp');

const prompt = require('prompt');

var sys = require('sys')
var exec = require('child_process').exec;
var child;

class UtilsClass {

	throwError(err) {
		console.log('err', err);
	}

	getFile(file, callback) {

		fs.readFile('./lib/'+file, 'utf-8', function(err, data) {
			callback(data);
		});
	}

	prompt(element, log = true) {

		prompt.start();

		return new Promise((resolve, reject) => {

			prompt.get([element], function (err, result) {

				if (err) console.log('err', err);

				if(log) {
					console.log("Processing " + element + " generation : " + result[element]);
				}

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

				let path = './components/'+response;

				mkdirp(path, (err) => {
					if(err) return this.throwError(err);

					path += '/';
					
					const filename = response+'.component';

					fs.writeFile(path+filename+'.ts', code.ts, (err) => {
						if(err) return this.throwError(err);

						fs.writeFile(path+filename+'.html', code.html, (err) => {
							if(err) return this.throwError(err);

							fs.writeFile(path+filename+'.scss', code.scss, (err) => {
								if(err) return this.throwError(err);
							});
						});
					});
				});
			});
		});
	}

	launchCommand(command, callback) {

		child = exec(command, function (error, stdout, stderr) {
		  sys.print('stdout: ' + stdout);
		  sys.print('stderr: ' + stderr);
		  if (error !== null) {
		    console.log('exec error: ' + error);
		  }

		  if(callback) callback();
		});
	}

	generateNewReactApp(appName) {
		console.log('generating new react app');

		this.launchCommand('sudo npm install -g react-cli react create-react-project && create-react-project '+appName, () => {});
	}

	generateNewAngularApp(appName) {
		console.log('generating new angular app');
		this.launchCommand('sudo npm install -g @angular/cli && ng new '+appName, () => {});
	}

	generateNewAngularJSApp(appName) {
		console.log('generating new angular js app');
		console.log('go downloading it on : https://angularjs.org/');
	}

	geneteNewExpressApp(appName) {
		console.log('generating new express js app');
		this.launchCommand('sudo npm install express-generator -g && express '+appName);
		console.log('Then go on : http://expressjs.com/fr/starter/generator.html');
	}

	generateNewFrontApp(appName) {

		this.prompt('React [R] - Angular [A] - AngularJS [AJ]', false).then((response) => {

			if(response.toLowerCase() === 'r') {

				this.generateNewReactApp(appName);

			} else if(response.toLowerCase() === 'a') {
				
				this.generateNewAngularApp(appName);

			} else if(response.toLowerCase() === 'aj') {

				this.generateNewAngularJSApp(appName);
				
			} else {
				console.log('You did not enter a valid response');
			}
		});
	}

	generateNewBackApp(appName) {

		this.prompt('Node Express [E]', false).then((response) => {

			if(response.toLowerCase() === 'e') {

				this.geneteNewExpressApp(appName);
				
			} else {
				console.log('You did not enter a valid response');
			}
		});
	}

	generateNewApp() {

		this.prompt('Your app name', false).then((appName) => {

			this.prompt('Front [F] - Back [B]', false).then((response) => {

				if(response.toLowerCase() === 'f') {

					this.generateNewFrontApp(appName);

				} else if(response.toLowerCase() === 'b') {

					this.generateNewBackApp(appName);
					
				} else {
					console.log('You did not enter a valid response');
				}
			});
		});

	}

	generateService() {
		this.prompt('service').then((response) => {

			this.getServiceCode(response).then((code) => {

				let path = './services/'+response;

				mkdirp(path, (err) => {
					if(err) return this.throwError(err);

					path += '/';
					
					const filename = response+'.service';

					fs.writeFile(path+filename+'.ts', code.ts, (err) => {

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
		
		console.log(element);

		switch(element) {

			case "component": {
				utils.generateComponent();
				break;
			}

			case "service": {
				utils.generateService();
				break;
			}

			case "app":
				utils.generateNewApp(); 
			break;

			default: {
				break;
			}
		}
	}
}

module.exports = new Webarranco();
