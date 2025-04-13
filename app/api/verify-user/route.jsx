import { NextResponse } from "next/server";
import { eq } from 'drizzle-orm';
import { Users } from '../../config/schema';
import { db } from "../../config/db";

export async function POST(req) {
    const { user } = await req.json();

    //If user already exist
    try {
        const userInfo = await db.select().from(Users)
            .where(eq(Users.email, user?.primaryEmailAddresses.emailAdress))
        console.log("User", userInfo);
        //If not
        if (userInfo?.length === 0) {
            const SaveResult = await db.insert(Users).values({
                name: user?.name,
                email: user?.primaryEmailAddresses.emailAdress,
                imageUrl: user?.imageUrl,
            }).returning({ Users })

            return NextResponse.json({ 'result': SaveResult[0].Users });
        }
        return NextResponse.json({ 'result': userInfo[0] });
    }
    catch (e) {
        return NextResponse.json({ error: e });
    }
}