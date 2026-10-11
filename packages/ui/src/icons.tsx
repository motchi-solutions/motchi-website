import { LuArrowRight, LuArrowUpRight, LuMail } from "react-icons/lu";
export function Arrow({
  external = false,
  className = "",
}: {
  external?: boolean;
  className?: string;
}) {
  const Icon = external ? LuArrowUpRight : LuArrowRight;
  return (
    <Icon
      aria-hidden="true"
      focusable="false"
      className={`interaction-arrow h-4 w-4 shrink-0 ${className}`}
    />
  );
}
export function MailIcon() {
  return (
    <LuMail aria-hidden="true" focusable="false" className="h-5 w-5 shrink-0" />
  );
}
