import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api";
import Field from "../components/Field";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { token, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const form = useForm(
    { email: "", password: "" },
    (v) => {
      const e = {};
      if (!emailRe.test(v.email)) e.email = "Enter a valid email";
      if (v.password.length < 6) e.password = "Password must be at least 6 characters";
      return e;
    },
    async (v) => {
      const { data } = await api.post("/auth/signin", v);
      login(data.token);
      toast(`Welcome back, ${data.user.name}`);
      navigate("/");
    }
  );

  if (token) return <Navigate to="/" replace />;

  return (
    <form className="auth-box card" onSubmit={form.submit} noValidate>
      <h2>Login Now</h2>
      {form.apiError && <div className="alert error">{form.apiError}</div>}
      <Field form={form} name="email" label="Email" type="email" />
      <Field form={form} name="password" label="Password" type="password" />
      <div className="row between">
        <Link to="/forgot-password">Forgot password?</Link>
        <button className="btn" disabled={form.loading}>{form.loading ? "Loading..." : "Login"}</button>
      </div>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </form>
  );
}
