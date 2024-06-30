import { Router, Request, Response } from "express";
import userRouter from "./userRouter";

const mainRouter = Router();

mainRouter.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello, World!",
  });
});

mainRouter.use("/users", userRouter);

export default mainRouter;
