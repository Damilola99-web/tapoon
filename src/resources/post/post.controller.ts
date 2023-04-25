import { Router, Request, Response, NextFunction } from 'express';
import Controller from "@/utils/interfaces/controller.interface";
import HttpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middleware/vaidation.middleware';
import validate from '@/resources/post/post.validation';
import PostService from '@/resources/post/post.service';

class PostController implements Controller {
    public path = "/posts";
    public router = Router();
    private PostService = new PostService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.post(
            `${this.path}`,
            validationMiddleware(validate.create),
            this.create
        );

        this.router.get(
            `${this.path}`,
            this.findAll
        );

        this.router.get(
            `${this.path}/:id`,
            this.findAPost
        );

        this.router.put(
            `${this.path}/:id`,
            validationMiddleware(validate.update),
            this.updateAPost
        );

        this.router.delete(
            `${this.path}/:id`,
            this.deleteAPost
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { title, body } = req.body;
            const postExists = await this.PostService.findSinglePost({ title });
            if (postExists) {
                throw new HttpException(400, `Post with title ${title} already exists`);
            }
            const post = await this.PostService.create(title, body);
            res.status(201).json({ post });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private findAll = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const posts = await this.PostService.findAll();
            res.status(200).json({ posts });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private findAPost = async(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const post = await this.PostService.findSinglePost({ _id: id });
            if (!post) {
                throw new HttpException(404, `Post with id ${id} not found`);
            }
            res.status(200).json({ post });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private updateAPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const { title, body } = req.body;
            const post = await this.PostService.findSinglePost({ _id: id });
            if (!post) {
                throw new HttpException(404, `Post with id ${id} not found`);
            }
            const updatedPost = await this.PostService.update(id, title, body);
            res.status(200).json({ updatedPost });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }

    private deleteAPost = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { id } = req.params;
            const post = await this.PostService.findSinglePost({ _id: id });
            if (!post) {
                throw new HttpException(404, `Post with id ${id} not found`);
            }
            await this.PostService.delete(id);
            res.status(200).json({ message: `Post with id ${id} deleted` });
        } catch (error: any) {
            next(new HttpException(400, error.message))
        }
    }
}

export default PostController;