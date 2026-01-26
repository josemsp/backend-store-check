export const extractBearerToken = (authHeader?: string): string | null => {
    if (!authHeader || authHeader.length < 8 || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.slice(7).trim();
    return token || null;
};
