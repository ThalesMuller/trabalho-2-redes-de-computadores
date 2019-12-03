//Importações de bibliotecas e componentes
import socketIOClient from 'socket.io-client';

let Client = class Client {
    chokidar = require('chokidar');
    fs = require('fs');

    serverSMTP = require('./serverSMTP');
    endpoint = "http://localhost:8899/";
    socket = {};
    clientName = "";
    folderName = "";
    serverFilesList = [];

    constructor() {
        this.clientName = readline();
        this.folderName = this.createFolder();

        this.socket = socketIOClient(this.state.endpoint);

        this.socket.on('connect', function () {
            this.socket.emit('newClient', this.clientName)
            this.createServerSideFolder();
            //this.serverFilesList = this.getServerFilesList();
        });
    }

    pingServer = () => {
        //pinga o server pra ver se esta online, envia email por smtp se estiver fora

        this.socket.emit('ping');
        if (!ping)
            this.enviarEmail('pingError');
        return ping;
    }

    enviarEmail = (action, file, dthr) => {
        switch (action) {
            case 'pingError':
                subject = "Erro de comunicação!";
                corpoMsg = "Houve um erro ao comunicar-se com o sistema.";
                serverSMTP.sendEmail();
                break;
            case 'newFile':
                subject = "Novo arquivo!";
                corpoMsg = "O arquivo " + file + " foi criado às " + dthr;
                serverSMTP.sendEmail();
                break;
            case 'modifyFile':
                subject = "Arquivo modificado!";
                corpoMsg = "O arquivo " + file + " foi modificado às " + dthr;
                serverSMTP.sendEmail();
                break;
            default:
                console.error("Algum erro aconteceu no switch bocó");
                break;
        }
    }

    createFolder = () => {
        let folderName = this.clientName.replace(' ', '_') + '_files';

        this.fs.mkdir(`/clientSideFolders/${folderName}`);

        return folderName;
    }

    createServerSideFolder = () => {
        this.socket.emit('createfolder', this.folderName);
    }

    getServerFilesList = () => {
        this.socket.emit('getfilesdata');

        this.socket.on('sendfiledata', (sender, content) => {
            content.forEach(file => {
                //
            });
        });
    
        
    }

    folderListener = () => {
        watcher = this.chokidar.watch(`/clientSideFolders/${this.folderName}`, { ignored: /^\./, persistent: true });

        watcher
            .on('add', function (path) { this.fileCreated(path); })
            .on('change', function (path) { this.fileModified(path); })
            .on('unlink', function (path) { this.fileDeleted(path); })
            .on('error', function (error) { this.watcherError(error); });

        //recursive infinite loop to watch folder
        this.folderListener();
    }

    fileCreated = (path) => {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        let content = fs.readFile(path, (err, data) => {
            if (err) throw err;
            return data.toString('base64');
        });
        let creationDthr = new Date().toString();

        this.socket.emit('createfile', fileName, content, creationDthr);
    }

    fileDeleted = (path) => {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        this.socket.emit('modifyfile', fileName);
    }

    fileModified = (path) => {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        let newContent = fs.readFile(path, (err, data) => {
            if (err) throw err;
            return data.toString('base64');
        });
        let modifyDthr = new Date().toString();

        this.socket.emit('deletefile', fileName, newContent, modifyDthr);
        this.enviarEmail('newFile', fileName, modifyDthr)
    }

    watcherError = (error) => {
        console.error("Erro no watcher: " + error);
    }
} 
