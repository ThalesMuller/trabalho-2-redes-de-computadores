import React, { Component } from 'react';

//Objeto responsavel por lidar com a caixa de digitação
class InputBox extends Component {

  state = {
    //Variavel onde será guardada a mensagem digitada pelo user
    text: ''
  }
  //handleChange é disparada quando o user digita algo no campo de input
  handleChange = (e) => {
    //Salva mensagem digitada pelo user
    this.setState({
      text: e.target.value
    })
  }

  //Função disparada quando o user envia a mensagem
  handleSubmit = (e) => {
    //Previne o comportamento normal do browser de atulizar a pagina
    e.preventDefault();
    //Limpa o campo de input
    this.setState({
      text: ''
    })
  }

  //Renderização, adicionando os event listeners aos componentes do html (onChange no campo de input, onClick no botão, etc)
  render() {
    return (
      <div className="inputbox">
        <form onSubmit={this.handleSubmit}>
          <div className="inpbox-inp">
            <input className="browser-default z-depth-1" placeholder="Digite algo..." type="text" onChange={this.handleChange} value={this.state.text}></input>
          </div>
          <div className="inpbox-submit">
            <button className="btn waves-effect waves-light deep-purple" type="submit" onClick={() => { this.props.onClick(this.state.text) }}>Enviar</button>
          </div>
        </form>
      </div>
    );
  }
}

export default InputBox;