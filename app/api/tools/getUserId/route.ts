import {NextResponse} from "next/server";
import {cookies} from "next/headers";

export async function GET(){
    const  userid  = (await cookies()).get('userId')?.value;
    console.log(userid);
    return NextResponse.json({userId: userid});
}