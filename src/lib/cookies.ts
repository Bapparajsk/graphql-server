import { Response, CookieOptions } from "express";

const singCookie = (token: string, res: Response, options?: CookieOptions) => {
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
        ...options, // Allow additional options to be passed
    });
};

const clearCookie = (res: Response) => {
    res.clearCookie("authToken");
};

export { singCookie, clearCookie };
