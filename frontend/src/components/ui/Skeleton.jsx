import "./Skeleton.css";

/** A single shimmering placeholder block. Compose these to match the shape of the content being loaded. */
function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${className}`.trim()} style={style} />;
}

export default Skeleton;
