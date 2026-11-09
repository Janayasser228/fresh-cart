import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="center-box">
      <h1>404</h1>
      <p>Page not found</p>
      <Link className="btn" to="/">Back home</Link>
    </div>
  );
}
