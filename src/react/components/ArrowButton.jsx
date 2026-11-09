import { ARROW } from "@/lib/constants";

export function ArrowButton({ children, ...props }) {
  return (
    <button {...props}>
      {children}
      <span aria-hidden="true">{ARROW}</span>
    </button>
  );
}
