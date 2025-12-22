const Button = ({ onClick, isActive, children, title, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    disabled={disabled}
    className={`p-2 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-[var(--color-primary)] text-white shadow-lg"
        : "text-[var(--text-secondary)] hover:bg-[var(--color-primary)]/20 hover:text-[var(--color-primary)]"
    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    title={title}
  >
    {children}
  </button>
);
export default Button;