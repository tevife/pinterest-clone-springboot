export default interface ICredentials {
    username: string,
    password: string,
    email?: string
}

export interface IToken {
    token: string
}

export const areInvalidCredentials = (credentials: ICredentials, emailProvided: boolean) => {
    if (isInvalidUsername(credentials.username) ||isInvalidPassword(credentials.password))
        return true;

    if (emailProvided) {
        return credentials.email?.length <= 0 || credentials.email?.length > 320;
    } else {
        return false;
    }
}

export const isInvalidUsername = (username: string) => {
    return username.length <= 0 || username.length > 39;
}

export const isInvalidPassword = (password: string) => {
    return password.length <= 0 || password.length > 100;
}

export interface IChangeUsernameRequest {
    username: string
}

export interface IChangePasswordRequest {
    oldPassword: string,
    newPassword: string
}

export interface IChangeImageUrlRequest {
    imageUrl: string
}
