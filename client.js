let chokidar = require('chokidar');
let socketIOClient = require('socket.io-client');
let fs = require('fs');
let = serverSMTP = require('./serverSMTP');

let Client = class {
    constructor(name) {
        this.endpoint = "http://localhost:8899/";
        this.clientName = name;
        this.folderName = this.createFolder();

        socket = socketIOClient(this.state.endpoint);

        socket.on('connect', function () {
            socket.emit('newClient', this.clientName)
            this.createServerSideFolder();
            //this.serverFilesList = this.getServerFilesList();
        });
    }

    pingServer() {
        //pinga o server pra ver se esta online, envia email por smtp se estiver fora
        socket.emit('ping');

        let ping;

        socket.on('pong', () => {
            ping = true;
        }, ping = false);

        if (!ping) this.enviarEmail('pingError');

        return ping;
    }

    enviarEmail(action, file, dthr) {
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

    createFolder() {
        let folderName = this.clientName.replace(' ', '_') + '_files';

        fs.mkdir(`/clientSideFolders/${folderName}`);

        return folderName;
    }

    createServerSideFolder() {
        socket.emit('createfolder', this.folderName);
    }

    getServerFilesList() {
        socket.emit('getfilesdata');

        socket.on('sendfiledata', (sender, content) => {
            content.forEach(file => {
                //
            });
        });


    }

    folderListener() {
        watcher = chokidar.watch(`/clientSideFolders/${this.folderName}`, { ignored: /^\./, persistent: true });

        watcher
            .on('add', function (path) { this.fileCreated(path); })
            .on('change', function (path) { this.fileModified(path); })
            .on('unlink', function (path) { this.fileDeleted(path); })
            .on('error', function (error) { this.watcherError(error); });

        //recursive infinite loop to watch folder
        this.folderListener();
    }

    fileCreated(path) {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        let content = fs.readFile(path, (err, data) => {
            if (err) throw err;
            return data.toString('base64');
        });
        let creationDthr = new Date().toString();

        socket.emit('createfile', fileName, content, creationDthr);
    }

    fileDeleted(path) {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        socket.emit('modifyfile', fileName);
    }

    fileModified(path) {
        let splitPath = path.split('/');
        let fileName = splitPath[splitPath.lenght() - 1];

        let newContent = fs.readFile(path, (err, data) => {
            if (err) throw err;
            return data.toString('base64');
        });
        let modifyDthr = new Date().toString();

        socket.emit('deletefile', fileName, newContent, modifyDthr);
        this.enviarEmail('newFile', fileName, modifyDthr)
    }

    watcherError(error) {
        console.error("Erro no watcher: " + error);
    }
}

const client = new Client("thales");