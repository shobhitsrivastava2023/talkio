import { validateRequest } from "@/lib/validate-request";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function POST(req: Request){
    const {session} = await validateRequest(); 
    if (!session) {
		return {
			error: "Unauthorized"
		};
	}

    await lucia.invalidateSession(session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	return redirect("/loginPage");



}