import React from 'react';

//Componente do caixa de mensagens, recebe pelo paramentro 'props' a lisa de mensagens a serem mostradas e renderiza-os na tela
const ChatBox = (props) => {
  //Renderização do componente
  return (
    <div className="chatbox z-depth-1">
      <ul className="chatbox-list">
        {props.list.map((msg) => {
          return (
            <li key={Math.random()}>
              {msg.sender !== '' ? (
                <div>
                  <span className="msg-sender">{msg.sender}:</span>
                  <span className="msg-text">{msg.text}</span>
                </div>
              ) : (
                  <div>
                    <span className="msg-text grey-text">{msg.text}</span>
                  </div>
                )}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default ChatBox;