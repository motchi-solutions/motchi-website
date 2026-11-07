import { getProjects } from "../../../content/websites/projects.ts";

export async function GET() {
  return Response.json(await getProjects());
}
