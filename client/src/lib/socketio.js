import io from "socket.io-client";

class Socket {
  url = "http://localhost:3000";
  client = null;

  constructor() {
    this.client = io(this.url);
  }

  addToken(token) {
    this.client = io(this.url, { query: { token } });
  }

  removeToken() {
    this.client = io(this.url);
  }
}

const instance = new Socket();

export default instance;
