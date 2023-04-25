import PostModel from "@/resources/post/post.model";
import Post from "@/resources/post/post.interface";

class PostService {
    private post = PostModel;

    /**
     * Create a ne post
     */
    public async create(title: string, body: string): Promise<Post> {
        try {
            const post = await this.post.create({ title, body }); //this refers to the PostModel
            return post;
        } catch (error) {
            throw new Error('Unable to create post');
        }
    }

    public async findSinglePost(id: Object): Promise<Post | null> {
        try {
            const post = await this.post.findOne({ _id: id });
            return post;
        } catch (error) {
            throw new Error('Unable to find post');
        }
    }

    public async findAll(): Promise<Post[]> {
        try {
            const posts = await this.post.find();
            return posts;
        } catch (error) {
            throw new Error('Unable to find posts');
        }
    }

    public async update(id: Object, title: string, body: string): Promise<Post | null> {
        try {
            const post = await this.post.findOneAndUpdate(
                { _id: id },
                { title, body },
                { new: true }
            );
            return post;
        } catch (error) {
            throw new Error('Unable to update post');
        }
    }

    public async delete(id: Object): Promise<Post | null> {
        try {
            const post = await this.post.findOneAndDelete({ _id: id });
            return post;
        } catch (error) {
            throw new Error('Unable to delete post');
        }
    }



}

export default PostService;