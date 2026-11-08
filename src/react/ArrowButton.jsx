const arrow = "→";
export function ArrowButton({ children, ...props }) {
  return (
    <button {...props}>
      {children}
      <span aria-hidden="true">{arrow}</span>
    </button>
  );
}
