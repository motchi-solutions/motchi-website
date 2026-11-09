/* One step of a branch's process, shared by the Websites and Consulting pages. */
export type ProcessStep = {
  id: string;
  title: string;
  summary: string;
  detailHeading?: string;
  details: readonly string[];
};
