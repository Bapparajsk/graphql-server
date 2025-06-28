export interface InputData {
    id?: number;
    email?: string;
    password?: string;
    name?: string;
    page?: number;
    limit?: number;
    title?: string;
    content?: string;
    otp?: string;
    identifier?: string;
    purpose?: "LOGIN" | "EMAIL_VERIFICATION";
}

export interface UserUpdateInput {
    name?: String
    bio?: String
    profilePic?: String
    backgroundPic?: Boolean
    oldPassword?: String
    newPassword?: String
}
