function newWebSocket() {
  return new WebSocket('ws://localhost:8001', ['echo-protocol']);
}

function onClose() {
  newConnection();
}

let webSocket = newWebSocket();

webSocket.onopen = function () {
  console.log(`dev-server connected ws://localhost:8001`);
};

function newConnection() {
  setTimeout(() => {
    let webSocket = newWebSocket();

    webSocket.onopen = function () {
      window.location.reload();
    };

    webSocket.onclose = onClose;
  }, 1500);
}

webSocket.onclose = onClose;
