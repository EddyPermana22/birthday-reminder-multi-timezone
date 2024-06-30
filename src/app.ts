import express from "express";
import mainRouter from "./routers/mainRouter";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mainRouter);

app.use(errorHandler);

export default app;
