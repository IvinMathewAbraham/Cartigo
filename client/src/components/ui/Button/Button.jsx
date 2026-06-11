import "./Button.css";

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
export default Button;