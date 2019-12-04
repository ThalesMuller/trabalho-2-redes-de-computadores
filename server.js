let {
	CONECTION,
	CREATE_FOLDER,
	NEW_CLIENT,
	CREATE_FILE,
	MODIFY_FILE,
	DELETED_FILE,
	GET_FILES_DATA,
	SEND_FILES_DATA,
	PING,
	PONG
} = require("./commands");

const PORT = 8899;

let express = require('express');
let socketio = require('socket.io');
let fs = require('fs');
let app = express();

fs.access('backupFolders/', fs.constants.F_OK, (err) => { err ? fs.mkdir("backupFolders/") : true });

let server = app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});

let io = socketio(server);
//Event listener para quando um novo client se conecta, objeto 'socket' corresponde a essa conexão
io.sockets.on(CONECTION, socket => {
	//Loga dados da nova conexão
	console.log(`Connected: ${socket.id}`);

	socket.on(CREATE_FOLDER, () => {
		let path = `backupFolders/${socket.folderName}`;

		if (!fs.existsSync(path)) {
			fs.mkdir(path);
		}

		if (!fs.existsSync(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`)) {
			let jsonContent = [];
			fs.writeFileSync(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, JSON.stringify(jsonContent));
		}
	});

	socket.on(NEW_CLIENT, (clientName) => {
		socket.clientName = clientName;
		socket.folderName = clientName.replace(' ', '_');
	});

	socket.on(CREATE_FILE, (fileName, content, creationDthr) => {
		let convertedContent = new Buffer(content, 'base64');

		fs.writeFile(`backupFolders/${socket.folderName}/${fileName}`, convertedContent, async (err) => {
			if (err) throw err;
			/* let controlJson = await getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`);

			controlJson.push({
				name: fileName,
				path: `backupFolders/${socket.folderName}/${fileName}`,
				dataCricao: creationDthr,
				dataUltimaModificacao: ""
			});

			setControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, controlJson); */
		});

	});

	socket.on(MODIFY_FILE, (fileName, newContent, modifyDthr) => {
		let convertedContent = new Buffer(newContent, 'base64');

		fs.writeFile(`backupFolders/${socket.folderName}/${fileName}`, convertedContent, (err) => {
			if (err) throw err;
			/* getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, (data) => {
				let controlJson = data;
				currentFile = controlJson.filter(r => r.name == fileName)[0];
				currentFileIndex = controlJson.IndexOf(currentFile);

				currentFile.push({
					name: currentFile.name,
					path: currentFile.path,
					dataCricao: currentFile.dataCricao,
					dataUltimaModificacao: modifyDthr
				});

				controlJson[currentFileIndex] = currentFile;

				setControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, controlJson); 
			});*/

		});
	});

	socket.on(DELETED_FILE, (fileName) => {
		fs.unlink(`backupFolders/${socket.folderName}/${fileName}`, async (err) => {
			if (err) throw err;

			/* let content = await getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`);
			content.splice(content.filter(r => r.fileName == fileName)[0], 1);

			setControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, content) */
		});
	});

	socket.on(GET_FILES_DATA, async () => {
		let content = await getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`)
		content = content.toString('base64');

		socket.emit(SEND_FILES_DATA, { content: content });
	});

	socket.on(PING, () => {
		socket.emit(PONG, { sender: socket.clientName, text: `bong bong` })
	});
});

async function getControlJsonData(path, callback) {
	fs.readFile(path, (err, data) => {
		if (err) throw err;
		callback(null, JSON.parse(data));
	});
}

async function setControlJsonData(path, content) {
	fs.writeFile(path, JSON.stringify(content), (err) => {
		if (err) throw err;
	});
}