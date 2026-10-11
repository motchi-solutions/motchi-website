import { handleContact } from "@motchi/email";
export const runtime = "nodejs";
export async function POST(request: Request) {
  return handleContact(request, "websites");
}
