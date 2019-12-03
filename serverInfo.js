//Importanção de bibliotecas necessarias
const os = require('os');
const getMac = require('getmac');

//Retorma um objeto com funções responsaveis por retornar diversos dados diferentes
module.exports = {
  //Retorna o nome do host, retirado da biblioteca nativa 'os'
  getServerName: () => 'Nome do servidor: ' + os.hostname(),
  //Retorna SO, a partir da biblioteca 'os'
  getServerOS: () => 'Sistema operacional do servidor: ' + os.platform(),
  //Porta em que o servidor rodará
  getServerPort: () => 8899,
  //Apenas retorna string com nomes dos devs
  getDev: () => 'Desenvolvido por Eduardo Brum Meurer, Igor Matheus Giacobi, João Carlos Ilha Baierle e Thales Eduardo Müller',
  //Retorna data atual usando o objeto nativo Date e montando string para o formato dd/mm/yyyy
  getServerDate: () => `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
  //Retorna IP do server usando biblioteca 'ip'
  getServerIp: () => 'IP do servidor: ' + require('ip').address(),
  //Retorna endereço MAC através da biblioteca 'getmac'
  getServerMac: () => {
    return new Promise((resolve, reject) => {
      //Chamada da biblioteca 'getmac'
      getMac.getMac((err, mac) => {
        if (err) throw err;
        //Retorno do MAC com formatação
        resolve('MAC do servidor: ' + mac.replace(/-/g, ':'));
      });
    })
  },
  //Retorna string com comandos disponiveis
  getHelp: () => {
    return 'Comandos disponiveis: /quem; /data; /ip; /mac; /sys; /dev;';
  }
}