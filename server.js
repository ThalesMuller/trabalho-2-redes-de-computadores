//Requisição de bibliotecas necessárias
//Express: framwork para criação do servidor NodeJS
let express = require('express');
//SocketIO: biblioteca usada para estabelecer toda a comunicação socket
let socketio = require('socket.io');
//Arquivos do servidor
let serverInfo = require('./serverInfo');
let msgHandler = require('./msgHandler');
//Biblioteca nativa para pegar informações sobre o host
let os = require('os');

//Cria o servidor com a framework 'Express'
let app = express();

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

	socket.on('create_folder', (dir) => {
		var fs  = require('fs');

		if (!fs.existsSync(dir)){	
			fs.mkdirSync(dir);
		};
		socket.emit('msglistupdate', { sender: '', text: `Pasta criada!` });
	});

	socket.on('receive_file', (filename, id, content, ins_dthr) => {
		socket.emit('msglistupdate', { sender: '', text: `Arquivo recebido!` });
	});

	socket.on('delete_file', (filename, id) => {
		socket.emit('msglistupdate', { sender: '', text: `Arquivo deletado!` });
	});

	//Event listener que espera eventos getfilesdata, retorna a lista de arquivos armazendos
	socket.on('getfilesdata', (clientName) => {
		
		//socket.broadcast.emit('msglistupdate', { sender: '', text: `${socket.nickname} entrou!` });
	});
});