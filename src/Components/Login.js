import React, { Component } from 'react';

//Componente da tela de login
class Login extends Component {
  state = {
    name: ''
  }
  //Disparada quando o user digita no campo de input
  handleChange = (event) => {
    //Salva o que o user digitou
    this.setState({
      name: event.target.value
    })
  }

  //Disparada quando o usuário acessar o app
  handleSubmit = (event) => {
    //Previne ações padrão do browser de atualzar a pagina
    event.preventDefault();
  }

  //Renderização, adiciona os event handlers aos componentes
  render() {
    return (
      <div className="loginbox">
        <form onSubmit={this.handleSubmit}>
          <div className="loginform-inp">
            <input required autoComplete="off" placeholder="Nickname" type="text" name="name" onChange={this.handleChange}></input>
          </div>
          <div className="loginform-submit">
            <button className="btn waves-effect waves-light deep-purple" type="submit" onClick={() => this.props.onClick(this.state.name)}>Entrar</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;