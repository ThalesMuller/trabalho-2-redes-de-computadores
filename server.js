//Express: framwork para criação do servidor NodeJS
let express = require('express');
//SocketIO: biblioteca usada para estabelecer toda a comunicação socket
let socketio = require('socket.io');
//Biblioteca nativa para pegar informações sobre o host
let os = require('os');
var fs = require('fs');

//Cria o servidor com a framework 'Express'
let app = express();

fs.access('backupFolders/', fs.constants.F_OK, (err) => { err ? fs.mkdir("backupFolders/") : true });

//Faz o servidor ouvir requisições na porta retornada do arquivo 'serverInfo' e salva informações na variavel 'server'
let server = app.listen(serverInfo.getServerPort(), () => {
	//Mensagem informando que o servidor está ouvindo na porta
	console.log(`Listening on port ${serverInfo.getServerPort()}`);
});

//Cria objeto io, que será usado para fazer as transmissões de mensagens
let io = socketio(server);
//Array auxiliar para guardar os usuários conectados no chat
let users = [];
//Event listener para quando um novo client se conecta, objeto 'socket' corresponde a essa conexão
io.sockets.on('connection', socket => {
	//Loga dados da nova conexão
	console.log(`Connected: ${socket.id}`);

	socket.on('createfolder', () => {
		let path = `backupFolders/${socket.folderName}`

		if (!fs.existsSync(path)) {
			fs.mkdir(path);

			let jsonContent = [];
			fs.writeFile(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, jsonContent);
		};
	});

	socket.on('newClient', (clientName) => {
		socket.clientName = clientName;
		socket.folderName = clientName.replace(' ', '_');
	});

	socket.on('createfile', (fileName, content, creationDthr) => {
		let convertedContent = content.toString('ascii');

		fs.writeFile(`backupFolders/${socket.folderName}/${fileName}`, convertedContent, (err) => {
			if (err) throw err;
			let controlJson = getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`);

			controlJson.push({
				name: fileName,
				path: `backupFolders/${socket.folderName}/${fileName}`,
				dataCricao: creationDthr,
				dataUltimaModificacao: ""
			});

			setControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, controlJson);
		});

	});

	socket.on('modifyfile', (fileName, newContent, modifyDthr) => {
		let convertedContent = newContent.toString('ascii');

		fs.writeFile(`backupFolders/${socket.folderName}/${fileName}`, convertedContent, (err) => {
			if (err) throw err;
			let controlJson = getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`);

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
		});
	});

	socket.on('ping', () => {
		socket.emit('pong', { sender: socket.clientName, text: `bong bong` })
	});

	socket.on('deletefile', (fileName) => {
		fs.unlink(`backupFolders/${socket.folderName}/${fileName}`, (err) => {
			if (err) throw err;

			let content = getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`);
			content.splice(content.filter(r => r.fileName == fileName)[0], 1);

			setControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`, content)
		});
	});

	//Event listener que espera eventos getfilesdata, retorna a lista de arquivos armazendos
	socket.on('getfilesdata', () => {
		let content = getControlJsonData(`backupFolders/${socket.folderName}/${socket.folderName}_fileControl.json`)
		content = content.toString('base64');

		socket.emit('sendfiledata', { content: content });
	});
});

getControlJsonData = (path) => {
	return fs.readFile(path, (err, data) => {
		if (err) throw err;
		return data;
	});
}

setControlJsonData = (path, content) => {
	fs.writeFile(path, content, (err) => {
		if (err) throw err;
	});
}