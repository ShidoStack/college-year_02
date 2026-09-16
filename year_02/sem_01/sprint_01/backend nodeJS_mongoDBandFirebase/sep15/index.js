
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", (socket) => {
  console.log("New connection done");

  socket.on("message", (msg) => {
    const mss = msg.toString();
    console.log("Message from browser:", text);

    if (mss === "Hi") {
      socket.send("Hello browsy");
    } else if (mss === "hello servy") {
      socket.send("hlo paji.. toh kaise ho aap log..");
    } else if (mss === "badhiya") {
      socket.send("oyeee badhiya.. guru thoko taali");
    } else {
      socket.send("sahi hai guru.. tussi sab changa");
    }
  });
});