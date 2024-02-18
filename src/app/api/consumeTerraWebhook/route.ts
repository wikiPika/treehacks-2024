import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Terra from "terra-api";

const terra = new Terra(process.env.TERRAAPI_DEVELOPER_ID ?? "", process.env.TERRAAPI_API_KEY ?? "", process.env.TERRA_WEBHOOK_SECRET ?? "");

export async function POST(request: NextRequest) {
  const res = await request.json();

  console.log(res);

  return NextResponse.json({ }, { status: 200}); 
}

async function streamToString(stream: NodeJS.ReadableStream): Promise<string> {
  const chunks: Array<any> = [];
  for await (let chunk of stream) {
      chunks.push(chunk)
  }
  const buffer = Buffer.concat(chunks);
  return buffer.toString("utf-8")
}
