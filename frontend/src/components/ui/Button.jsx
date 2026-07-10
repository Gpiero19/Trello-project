/**
 * variant: primary (default, no extra class — base.css already styles <button> as primary)
 *          secondary | danger
 */
function Button({ variant = "primary", className = "", ...props }) {
  const variantClass = variant === "primary" ? "" : `btn-${variant}`;
  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}

export default Button;
