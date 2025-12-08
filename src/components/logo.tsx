import { cn } from "@/lib/utils";

const Logo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("lucide lucide-message-circle-code", className)}
  >
    <path d="M7.9 20.1 6 22l-4-4-3 3" />
    <path d="m10 10-2 2 2 2" />
    <path d="m14 10 2 2-2 2" />
    <path d="M12 21a9 9 0 0 0-9-9 9 9 0 0 0 9 9Z" />
  </svg>
);

export default Logo;
