//Importações de bibliotecas e componentes
import socketIOClient from 'socket.io-client';

let Client = class Client {
    chokidar = require('chokidar');
    fs = require('fs');

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
            this.createServerSideFolder();
            this.serverFilesList = this.getServerFilesList();
        });
    }

    pingServer = () => {
        //pinga o server pra ver se esta online, envia email por smtp se estiver fora

        let ping = true;

        if (!ping)
            this.enviarEmail('pingError');
            
        return ping;
    }

    enviarEmail = (action, file) => {
        switch(action){
            case 'pingError':
                break;
            case 'newFile':
                break;
            case 'modifyFile':
                break;
            case 'deleteFile':
                break;
            default:
                break;
        }
    }

    createFolder = () => {
        let folderName = this.clientName.replace(' ', '_') + '_files';

        this.fs.mkdir(`/clientSideFolders/${folderName}`);

        return folderName;
    }

    createServerSideFolder = () => {
        this.socket.emit('createbkpfolder', this.folderName);
    }

    getServerFilesList = () => {
        this.socket.emit('getfilesdata', this.clientName);
    }

    folderListener = () => {
        watcher = this.chokidar.watch(`/clientSideFolders/${this.folderName}`, { ignored: /^\./, persistent: true });

        watcher.on('add', function (path) { console.log('File', path, 'has been added'); })
        watcher.on('change', function (path) { console.log('File', path, 'has been changed'); })
        watcher.on('unlink', function (path) { console.log('File', path, 'has been removed'); })
        watcher.on('error', function (error) { console.error('Error happened', error); })


        //recursive infinite loop to watch folder
        this.folderListener();
    }
} 
