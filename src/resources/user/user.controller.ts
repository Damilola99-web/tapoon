import { Router, Request, Response, NextFunction } from 'express';
import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/vaidation.middleware';
import validate from "@/resources/user/user.validation";
import UserService from '@/resources/user/user.service';
import authenticaed from "@/middleware/authenticated.middleware";

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private userService = new UserService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(`${this.path}/register`, validationMiddleware(validate.register), this.register);
        this.router.post(`${this.path}/login`, validationMiddleware(validate.login), this.login);
        this.router.get(`${this.path}/me`, authenticaed, this.getUser);
    }

    private register = async (
        request: Request,
        response: Response,
        next: NextFunction): Promise<Response | void> => {
        try {
            const { name, email, password, role } = request.body;
            const accessToken = await this.userService.register(name, email, password, role);
            response.status(201).json({ accessToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private login = async (
        request: Request,
        response: Response,
        next: NextFunction): Promise<Response | void> => {
        try {
            const { email, password } = request.body;
            const accessToken = await this.userService.login(email, password);
            response.status(200).json({ accessToken });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    }

    private getUser = async(
        request: Request,
        response: Response,
        next: NextFunction): Promise<Response | void> => {
        try {
            if (!request.user) {
                return next(new HttpException(400, 'User not found'));
            }
            response.status(200).json({ user: request.user });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }

    }
}

export default UserController;