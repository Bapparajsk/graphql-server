export function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return name[0] + "*".repeat(Math.max(name.length - 1, 1)) + "@" + domain;
}

export function convertDateToISO(date: Date | string): string {
    if (typeof date === "string") {
        date = new Date(date);
    } else if (!(date instanceof Date)) {
        throw new Error("Invalid date format");
    }
    return date.toISOString();
}

export const transformPost = (post: any) => ({
    ...post,
    createdAt: convertDateToISO(post.createdAt),
});

export const transformComment = (comment: any, author?: any) => ({
    ...comment,
    createdAt: convertDateToISO(comment.createdAt),
    updatedAt: convertDateToISO(comment.updatedAt),
    ...(author && { author }),
});
