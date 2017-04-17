import Client from 'socket.io-client'

const Socket = new Client('http://vps.aviro.io:3000');

export default Socket