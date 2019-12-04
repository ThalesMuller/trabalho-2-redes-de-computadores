"use strict";

const chokidar = require('chokidar');
const endpoint = "http://localhost:8899/";
const socket = require('socket.io-client')(endpoint);
const fs = require('fs');
const serverSMTP = require('./serverSMTP');

class Client {

    constructor(name) {
        this.clientName = name;
        this.folderName = this.createFolder();

        fs.access('clientSideFolders/', fs.constants.F_OK, (err) => { err ? fs.mkdir("clientSideFolders/") : true });

        socket.emit('newClient', this.clientName);
        this.createServerSideFolder();
        //this.serverFilesList = this.getServerFilesList();
        this.folderListener();
    }

    createServerSideFolder() {
        socket.emit('createfolder', this.folderName);
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

        fs.access(`./clientSideFolders/${folderName}`, fs.constants.F_OK, (err) => { err ? fs.mkdir(`./clientSideFolders/${folderName}`) : true });

        return folderName;
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
        let watcher = chokidar.watch(`./clientSideFolders/${this.folderName}/*`, { persistent: true, ignoreInitial: true });


        watcher
            .on('add', path => { this.fileCreated(path); })
            .on('change', path => { this.fileModified(path); })
            .on('unlink', path => { this.fileDeleted(path); })
            .on('error', error => { this.watcherError(error); });
    }

    fileCreated(path) {
        let splitPath = path.split(/\\+/g);;
        let fileName = splitPath[splitPath.length - 1];
        let creationDthr = new Date().toString();

        fs.readFile(path, (err, data) => {
            if (err) throw err;
            socket.emit('createfile', fileName, data.toString('base64'), creationDthr);
        });
    }

    fileDeleted(path) {
        let splitPath = path.split(/\\+/g);;
        let fileName = splitPath[splitPath.length - 1];

        socket.emit('modifyfile', fileName);
    }

    fileModified(path) {
        let splitPath = path.split(/\\+/g);;
        let fileName = splitPath[splitPath.length - 1];
        let modifyDthr = new Date().toString();

        fs.readFile(path, (err, data) => {
            if (err) throw err;
            socket.emit('deletefile', fileName, data.toString('base64'), modifyDthr);
            this.enviarEmail('newFile', fileName, modifyDthr)
        });
    }

    watcherError(error) {
        console.error("Erro no watcher: " + error);
    }
}

const client = new Client("thales");