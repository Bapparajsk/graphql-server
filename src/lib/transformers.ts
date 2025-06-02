export function maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    return name[0] + '*'.repeat(Math.max(name.length - 1, 1)) + '@' + domain;
}
