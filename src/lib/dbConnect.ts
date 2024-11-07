import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

export const dbConnect = async () => {
  if (connection.isConnected) {
    return console.log("already connected");
  }
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: "practice",
    });
    connection.isConnected = connect.connection.readyState;
    console.log("database connected", connect.connection.readyState);
  } catch (error) {
    console.log("database connecion error:", error);
    process.exit(1);
  }
};
