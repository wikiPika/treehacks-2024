import { NextRequest, NextResponse } from "next/server";
import Terra from "terra-api";

const terra = new Terra(process.env.TERRAAPI_DEVELOPER_ID ?? "", process.env.TERRAAPI_API_KEY ?? "", process.env.TERRA_WEBHOOK_SECRET ?? "");

export async function GET(request: NextRequest) {
    const resp = await terra.generateWidgetSession({
        referenceID: "HelloStanford",
        language: "en",
        authSuccessRedirectUrl: "http://localhost:3000/demo",
        authFailureRedirectUrl: "http://localhost:3000/demo"
    })
        return NextResponse.json({ data: resp }, { status: 200}); 
}