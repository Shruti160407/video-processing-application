export const videoSocket = (io) => {
  io.on("connection", socket => {
    console.log("Client connected");
  });
};
