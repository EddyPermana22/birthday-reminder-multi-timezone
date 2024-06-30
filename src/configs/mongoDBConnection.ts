import mongoose from "mongoose";

const mongoDBConnection = async (mongoDBURI: string): Promise<void> => {
  try {
    console.info("Connecting to database...");
    await mongoose.connect(mongoDBURI);
    console.info("Database connected!");
  } catch (error) {
    console.error(`Failed to connect to database: ${error}`);
    throw error;
  }
};

export default mongoDBConnection;
