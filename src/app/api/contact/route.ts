import { handleContact } from "../../../lib/email/index.ts";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleContact(request, "solutions");
}
