import {Request, Response, NextFunction} from "express";
import {AuthService} from "../../../application/services/auth.service";
import {validateCreateUserDto} from "../dtos/create-user.dto";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  findUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {email} = req.params;
      if (!email) throw new Error("Email parameter is required");

      const user = await this.authService.findUserByEmail({email});

      res.status(200).json({
        success: true,
        data: user?.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createUserDto = validateCreateUserDto(req.body);
      const user = await this.authService.createUser(createUserDto);

      res.status(201).json({
        success: true,
        data: user.toJSON(),
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
