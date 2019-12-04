"use strict";

const chokidar = require('chokidar');
const endpoint = "http://localhost:8899/";
const socket = require('socket.io-client')(endpoint);
const fs = require('fs');
const serverSMTP = require('./serverSMTP');

let {
    CREATE_FOLDER,
    NEW_CLIENT,
    CREATE_FILE,
    MODIFY_FILE,
    DELETED_FILE,
    GET_FILES_DATA,
    SEND_FILES_DATA,
    PING,
    PONG,
    PING_ERROR
} = require("./commands");

class Client {

    constructor(name) {
        this.clientName = name;
        this.folderName = this.createFolder();

        fs.access('clientSideFolders/', fs.constants.F_OK, (err) => { err ? fs.mkdir("clientSideFolders/") : true });

        socket.emit(NEW_CLIENT, this.clientName);
        this.createServerSideFolder();
        //this.serverFilesList = this.getServerFilesList();
        this.folderListener();
    }

    createServerSideFolder() {
        socket.emit(CREATE_FOLDER, this.folderName);
    }

    pingServer() {
        //pinga o server pra ver se esta online, envia email por smtp se estiver fora
        socket.emit(PING);

        let ping;

        socket.on(PONG, () => {
            ping = true;
        }, ping = false);

        if (!ping) this.enviarEmail(PING_ERROR);

        return ping;
    }

    enviarEmail(action, file, dthr) {
        let subject;
        let corpoMsg;

        switch (action) {
            case PING_ERROR:
                subject = "Erro de comunicação!";
                corpoMsg = "Houve um erro ao comunicar-se com o sistema.";
                serverSMTP.sendEmail(subject, corpoMsg);
                break;
            case NEW_CLIENT:
                subject = "Novo arquivo!";
                corpoMsg = "O arquivo " + file + " foi criado às " + dthr;
                serverSMTP.sendEmail(subject, corpoMsg);
                break;
            case MODIFY_FILE:
                let subject = "Arquivo modificado!";
                corpoMsg = "O arquivo " + file + " foi modificado às " + dthr;
                serverSMTP.sendEmail(subject, corpoMsg);
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
        socket.emit(GET_FILES_DATA);

        socket.on(SEND_FILES_DATA, (sender, content) => {
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
            socket.emit(CREATE_FILE, fileName, data.toString('base64'), creationDthr);
            this.enviarEmail(commands.getNewFile(), fileName, creationDthr)
        });
    }

    fileDeleted(path) {
        let splitPath = path.split(/\\+/g);;
        let fileName = splitPath[splitPath.length - 1];

        socket.emit(DELETED_FILE, fileName);
    }

    fileModified(path) {
        let splitPath = path.split(/\\+/g);;
        let fileName = splitPath[splitPath.length - 1];
        let modifyDthr = new Date().toString();

        fs.readFile(path, (err, data) => {
            if (err) throw err;
            socket.emit(MODIFY_FILE, fileName, data.toString('base64'), modifyDthr);
            this.enviarEmail(MODIFY_FILE, fileName, modifyDthr)
        });
    }

    watcherError(error) {
        console.error("Erro no watcher: " + error);
    }
}

const client = new Client("thales");