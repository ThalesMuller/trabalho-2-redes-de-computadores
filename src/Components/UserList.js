import React from 'react';

//Componente que renderiza a lista de users online, recebe a lista de users no parametro 'props'
const UserList = (props) => {
  //Retorna o HTML para ser renderizado
  return (
    <div className="userlist z-depth-1">
      <h5>Usuários online</h5>
      <ul>
        {props.list.map(user => <li key={Math.random()}>{user.nickname}</li>)}
      </ul>
    </div>
  );
}

export default UserList;