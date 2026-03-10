import connectDB from '@/lib/mongodb';
import Member from '@/models/Member';
import GeneralMembersClient from './GeneralMembersClient';

// Forced dynamic rendering so we always get the freshest database list
export const dynamic = 'force-dynamic';

export default async function GeneralMembersPage() {
    let members = [];
    let error = null;

    try {
        await connectDB();
        // Fetch members, sort by newest first, and convert Mongoose docs to plain JS objects
        const docs = await Member.find({}).sort({ createdAt: -1 }).lean();

        // Convert _id to string for Next.js Client Component serialization
        members = docs.map(doc => ({
            ...doc,
            _id: doc._id.toString(),
            createdAt: doc.createdAt?.toISOString() || null
        }));

    } catch (err) {
        console.error("Failed to fetch general members:", err);
        error = err.message;
    }

    if (error) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200">
                    <h2 className="text-lg font-bold mb-2">Error Loading Members</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <GeneralMembersClient members={members} />
        </div>
    );
}
