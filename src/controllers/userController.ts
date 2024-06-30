import { Request, Response, NextFunction } from "express";
import cityTimezones from "city-timezones";

import userService from "../services/userService";
import { userSchema } from "../validators/userValidator";
import { CustomError } from "../middlewares/errorHandler";

class UserController {
  static async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await userSchema.validate(req.body, { abortEarly: false });

      const user = await userService.createUser(req.body);

      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        next(new CustomError(error?.message, 400));
      } else {
        next(error);
      }
    }
  }

  static async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 500));
      } else {
        next(error);
      }
    }
  }

  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);

      if (!user) {
        throw new CustomError("User not found", 404);
      }
      res.status(200).json({
        message: "User retrieved successfully",
        user,
      });
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 500));
      } else {
        next(error);
      }
    }
  }

  static async updateUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await userSchema.validate(req.body, { abortEarly: false });

      const userId = req.params.id;
      const { firstName, lastName, email, birthdate, location } = req.body;

      const cityLookup = cityTimezones.lookupViaCity(location);

      if (cityLookup.length === 0) {
        throw new CustomError(
          "Invalid location, please provide a valid city name.",
          400
        );
      }

      const updateUserData = {
        firstName,
        lastName,
        email,
        birthdate,
        location: cityLookup[0],
      };

      const user = await userService.updateUserByUserId(userId, updateUserData);

      if (!user) {
        throw new CustomError("User not found", 404);
      }

      res.status(200).send(user);
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 400));
      } else {
        next(error);
      }
    }
  }

  static async deleteUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await userService.deleteUserById(req.params.id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }
      res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        next(new CustomError(error.message, 500));
      } else {
        next(error);
      }
    }
  }
}

export default UserController;
