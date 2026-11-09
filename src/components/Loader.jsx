export function Loader() {
  return (
    <div className="loader-wrap">
      <div className="spinner" />
    </div>
  );
}

export function ErrorBox({ message }) {
  return <div className="alert error">{message}</div>;
}

export function Empty({ text }) {
  return <div className="empty">{text}</div>;
}
