
import { handlers } from "@/auth"
export const { GET } = handlers

import { checkBotId } from 'botid/server';
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const verification = await checkBotId();
    if (verification.isBot) {
        return NextResponse.json({ error: 'Bot detected' }, { status: 403 });
    }
    return handlers.POST(req);
}
