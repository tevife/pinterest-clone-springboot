import IUser, {IUsers} from "./IUser";

export default interface IPost {
    id: number,
    imageUrl: string,
    description: string,
    createdOn: string,
    creator: IUser,
    likedByUsers: IUsers
}

export interface IPosts extends Array<IPost> {}
