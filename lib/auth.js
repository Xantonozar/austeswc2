import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function getAdminFromSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            id: decoded.id,
            username: decoded.username,
            name: decoded.name,
            role: decoded.role,
        };
    } catch {
        return null;
    }
}
