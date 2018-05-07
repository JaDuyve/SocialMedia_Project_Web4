import { User } from './user.model';
export class Comment {
    private _id: string;
    private _message: string;
    private _created: Date;
    private _author: User;
    private _likes: Set<string>;
    private _dislikes: Set<string>;
    private _comments: Comment[];
    private _questionId: string;
    private _authorId: string; 
    private _dataImage: string;
    private _contentType: string;


    constructor(
        message: string,
        author: User,
        questionId?: string,
        created: Date = new Date(),
        likes: Set<string> = new Set(),
        dislikes: Set<string> = new Set(),
        comments: Comment[] = new Array(), 
        dataImage: string = "",
        contentType: string = ""
    ) {

        this._message = message;
        this._author = author;
        this._questionId = questionId;
        this._created = created;
        this._likes = likes;
        this._dislikes = dislikes;
        this._comments = comments;
        this._dataImage = dataImage;
        this._contentType = contentType;
    }



    get message(): string {
        return this._message;
    }


    get created(): Date {
        return this._created;
    }

    get author(): User {
        return this._author;
    }

    get likes(): Set<string> {
        return this._likes;
    }

    get dislikes(): Set<string> {
        return this._dislikes;
    }

    get comments(): Comment[] {
        return this._comments;
    }

    get questionId(): string {
        return this._questionId;
    }

    get id(): string {
        return this._id;
    }

    get dataImage(): string {
        return this._dataImage;
    }

    get contextType(): string{
        return this._contentType;
    }

    set authorId(id : string) {
        this._authorId = id;
    }

    addLike(username: string) {
        this._likes.add(username);
    }

    addDislike(username: string) {
        this._dislikes.add(username);
    }

    showAantalLikes() : number {
        return this._likes.size;
    }

    showAantalDislikes(): number{
        return this._dislikes.size;
    }

    addComment(comment: Comment) {
        this._comments.push(comment);
    }

    static fromJSON(json: any): Comment {
        const comment = new Comment(
            json.message,
            User.fromJSON(json),
            json.questionId,
            json.created,
            new Set(json.likes),
            new Set(json.dislikes),
            json.comments.map(Comment.fromJSON),
            json.dataImage,
            json.contentType
        );

        comment._id = json._id;
        return comment;
    }

    toJSON() {
        return {
            _id: this._id,
            message: this._message,
            created: this._created,
            authorId: this._authorId,
            likes: Array.from(this._likes),
            dislikes: Array.from(this._dislikes),
            comments: this._comments.map(i => i.toJSON()),
            questionId: this._questionId,
            dataImage: this._dataImage,
            contentType: this._contentType
        }
    }
}