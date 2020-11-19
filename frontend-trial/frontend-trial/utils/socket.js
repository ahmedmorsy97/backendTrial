import io from "socket.io-client";
let socket;
const endpoint =
  process.env.NODE_ENV === "production"
    ? "https://damp-waters-55084.herokuapp.com"
    : "http://localhost:5000";
var connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};
export const initiateSocket = (data) => {
  socket = io(endpoint, connectionOptions);
  console.log(`Connecting socket...`);
  if (socket && data.placeId) socket.emit("placeJoin", data);
};
export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};
// export const subscribeToChat = (cb) => {
//   if (!socket) return true;
//   socket.on("chat", (msg) => {
//     console.log("Websocket event received!");
//     return cb(null, msg);
//   });
// };
// export const sendMessage = (room, message) => {
//   if (socket) socket.emit("chat", { message, room });
// };

export const subscribeToWaitingList = (cb) => {
  if (!socket) return true;
  socket.on("reqUpdateWaitingList", (msg) => {
    console.log("Req to Update WaitingList received!");
    return cb(null, msg);
  });
};
export const updateWaitingList = (placeId, message) => {
  if (socket) socket.emit("updateWaitingList", { message, placeId });
};
