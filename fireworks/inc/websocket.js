function init_websocket(uri){
  socket = new Websocket(uri, null, {rejectUnauthorized: false});
}
