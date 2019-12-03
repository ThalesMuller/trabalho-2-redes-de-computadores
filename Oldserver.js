//Requisição de bibliotecas necessárias
//Express: framwork para criação do servidor NodeJS
let express = require('express');
//SocketIO: biblioteca usada para estabelecer toda a comunicação socket
let socketio = require('socket.io');
//Arquivos do servidor
let serverInfo = require('./serverInfo');
//let msgHandler = require('./msgHandler');
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


	//Event listener que espera eventos getfilesdata, retorna a lista de arquivos armazendos
	socket.on('getfilesdata', (clientName) => {
		//socket.broadcast.emit('msglistupdate', { sender: '', text: `${socket.nickname} entrou!` });
	});
	socket.on('createFile', (fileName, id, fileContent, createDate) => {
		
		//cria arquivo na pasta

	});


	//Event listener que espera eventos 'newuser', correspondentes a tela de login
	/* socket.on('newuser', (nickname) => {
		//Salva o nickname do novo usuario
		socket.nickname = nickname;
		//Insere ele na lista de users
		users.push({
			nickname: socket.nickname,
			id: socket.id
		});
		//Printa lista de users no terminal
		console.log('User list:');
		console.log(users);
		//Emite um novo event para todos os clients informando que um novo client se conectou
		io.emit('userlistupdate', users);
		//Emite em broadcast uma mensagem para todos os clients exceto o que se conectou, para informar sobre a conexão do mesmo
		socket.broadcast.emit('msglistupdate', { sender: '', text: `${socket.nickname} entrou!` });
	}); */

	//Event listener para quanto uma nova mensagem é transmitida por algum dos clients
	/* socket.on('newmsg', (msgData) => {
		//Loga mensagem no terminal
		console.log('Message received: ', msgData);
		//Função que processa a nova mensagem, determina se é um comando ou não, e envia para os clients
		msgHandler(msgData, io, socket); 
	})*/

	//Event listener para quando um client se desconecta
	/* socket.on('disconnect', () => {
		//Loga no terminal
		console.log(`Disconnected: ${socket.id}`);
		//Emite para todos os clients sobre a desconexão deste client
		io.emit('msglistupdate', { sender: '', text: `${socket.nickname} saiu!` });
		//Remove client desconectado da lista de clients
		users = users.filter(function (user) {
			return user.id !== socket.id;
		});
		//Emite nova lista de clients conectados
		io.emit('userlistupdate', users);
	}) */
});

function create_folder(dir){
    var fs = require('fs');

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}

function receive_file(){
    console.log("Recebeu");
}

function delete_file(){
    console.log("Deletou");
}

