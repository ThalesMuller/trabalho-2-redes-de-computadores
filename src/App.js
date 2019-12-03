//Importações de bibliotecas e componentes
import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import Login from './Components/Login';
import UserList from './Components/UserList';
import ChatBox from './Components/ChatBox';
import InputBox from './Components/InputBox';
import 'materialize-css/dist/css/materialize.min.css'
import M from 'materialize-css'

class App extends Component {
  state = {
    //Endereço do servidor para estabelecer conexão socket
    endpoint: "http://localhost:8899/",
    //Nickname do client
    thisUser: '',
    //Lista de usuários, que será populada pelo servidor
    userList: [],
    //Lista de mensagens, também será populada pelo servidor
    messageList: [],
    //Objeto que guardará a conexão socket
    socket: {}
  }
  //Hook para quando o componente é carregado
  componentDidMount() {
    //Inicializa alguns componentes da biblioteca MaterializeCSS
    M.AutoInit();
  }
  //Função que estabelece a conexão socket com o server e emite mensagem com nickname do novo client
  loginEmit = (name) => {
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

  //Função responsável por renderizar o app (HTML)
  render() {
    return (
      <div className="App">
        {this.state.thisUser === '' ? (
          <Login onClick={this.loginEmit.bind(this)} />
        ) : (
            <div className="chat-container">
              <UserList list={this.state.userList}></UserList>
              <ChatBox list={this.state.messageList}></ChatBox>
              <InputBox onClick={this.messageEmit.bind(this)}></InputBox>
            </div>
          )}
      </div>
    );
  }
}
//Exporta a classe App desse arquivo
export default App;