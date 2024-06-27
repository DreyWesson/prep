import mongoose, { mongo } from "mongoose";

export const connectNOSQL = async () => {
  try {
    const uri = process.env.NOSQL_URI;
    await mongoose.connect(uri);

  } catch (error) {
    console.error("Error: ", error);
  }
};

export const mongooseStatus = async (mongoose) => {
  mongoose.connection.on("connected", () =>
    console.log("Connected to MongoDB")
  );
  mongoose.connection.on("error", (err) =>
    console.error("MongoDB connection error:", err)
  );
  mongoose.connection.on("disconnected", () =>
    console.log("MongoDB disconnected")
  );
}