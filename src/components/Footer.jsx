import { Logo } from "./Icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Logo />
        <p>Get your daily needs from our store — fresh, fast, and delivered to your door.</p>
        <small>© {new Date().getFullYear()} FreshCart Clone — educational project</small>
      </div>
    </footer>
  );
}
