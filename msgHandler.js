//Requisita função do arquivo serverInfo, responsavel por fazer as chamadas de API e tal
let serverInfo = require('./serverInfo');

module.exports = async (msg, io, socket) => {
  //Cria objeto auxiliar que contera a mensagem a ser enviada para o client
  let msgAux = {
    text: '',
    sender: ''
  }
  //Verifica se mensagem é um comando ou mensagem normal
  //Se for comando, retorna a informação do objeto serverInfo, senão, apenas trannsmite a mensagem
  if (msg.text.split('').indexOf('/') == 0) {
    switch (msg.text) {
      case '/quem':
        msgAux.text = serverInfo.getServerName();
        break;
      case '/data':
        msgAux.text = serverInfo.getServerDate();
        break;
      case '/ip':
        msgAux.text = serverInfo.getServerIp();
        break;
      case '/mac':
        msgAux.text = await serverInfo.getServerMac();
        break;
      case '/sys':
        msgAux.text = serverInfo.getServerOS();
        break;
      case '/dev':
        msgAux.text = serverInfo.getDev();
        break;
      case '/help':
        msgAux.text = serverInfo.getHelp();
        break;
      default:
        msgAux.text = 'Comando não reconhecido, use /help para ver a lista de comandos';
    }
    //Envia mensagem apenas para o client que requisitou o comando
    socket.emit('msglistupdate', msgAux);
  } else {
    //Envia mensagem para todos os clientes conectados
    io.emit('msglistupdate', msg);
  }
}