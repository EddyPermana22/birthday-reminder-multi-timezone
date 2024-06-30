import dotenv from "dotenv";
dotenv.config();

import app from "./src/app";
import mongoDBConnection from "./src/configs/mongoDBConnection";

const port = process.env.PORT || 3000;
const mongoDBURI = process.env.MONGODB_URI;

if (!mongoDBURI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const startServer = async (
  application: typeof app,
  port: number | string,
  dbConnection: (uri: string) => Promise<void>
): Promise<void> => {
  try {
    await dbConnection(mongoDBURI);

    application.listen(port, () => {
      console.log(`App is running on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer(app, port, mongoDBConnection);
