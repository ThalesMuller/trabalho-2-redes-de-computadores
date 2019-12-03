//Importações de bibliotecas e componentes
import socketIOClient from 'socket.io-client';


const state = {
  //Endereço do servidor para estabelecer conexão socket
  endpoint: "http://localhost:8899/",
  //Objeto que guardará a conexão socket
  socket: {}
}

//Função que estabelece a conexão socket com o server e emite mensagem com nickname do novo client
/* loginEmit = (name) => {
  //Define nickname do novo usuario
  this.setState({
    thisUser: name
  });
  //Inicia conexão socket
  this.setState(
    //Função socketIOClient recebe o endereço do server e estabeleve a conexão
    { socket: socketIOClient(this.state.endpoint) },
    //Callback para quando a conexão foi estabelecida
    () => {
      //Objeto 'socket' sera usado para enviar e receber mensagens
      const socket = this.state.socket;
      //Emite mensagem para o servidor com os dados do novo user
      socket.emit('newuser', name);
      //Event listener para quando a lista de users é atualizada
      socket.on('userlistupdate', (userList) => {
        this.setState({ userList });
      });
      //Event listener para quando a lista de mensagens é atualizada
      socket.on('msglistupdate', (msg) => {
        this.setState({ messageList: [...this.state.messageList, msg] })
      });
    });
}
 */
//Função responsavel por emitir uma mensagem digitada pelo user para o servidor
messageEmit = (msgData) => {
  //Objeto msg contem dados da mensagem
  let msg = {
    text: msgData,
    sender: this.state.thisUser
  }
  //Objeto do socket
  const socket = this.state.socket;
  //Emite dados da mensagem para o servidor
  socket.emit('newmsg', msg);
}




