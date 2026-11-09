import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Field from "../components/Field";
import useForm from "../hooks/useForm";
import { useToast } from "../context/ToastContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^01[0125][0-9]{8}$/; 

export default function Register() {
  const toast = useToast();
  const navigate = useNavigate();

  const form = useForm(
    { name: "", email: "", phone: "", password: "", rePassword: "" },
    (v) => {
      const e = {};
      if (v.name.trim().length < 3) e.name = "Name must be at least 3 characters";
      if (!emailRe.test(v.email)) e.email = "Enter a valid email";
      if (!phoneRe.test(v.phone)) e.phone = "Enter a valid Egyptian phone (01xxxxxxxxx)";
      if (v.password.length < 6) e.password = "Password must be at least 6 characters";
      if (v.rePassword !== v.password) e.rePassword = "Passwords do not match";
      return e;
    },
    async (v) => {
      await api.post("/auth/signup", v);
      toast("Account created, please login");
      navigate("/login");
    }
  );

  return (
    <form className="auth-box card" onSubmit={form.submit} noValidate>
      <h2>Register Now</h2>
      {form.apiError && <div className="alert error">{form.apiError}</div>}
      <Field form={form} name="name" label="Name" />
      <Field form={form} name="email" label="Email" type="email" />
      <Field form={form} name="phone" label="Phone" type="tel" />
      <Field form={form} name="password" label="Password" type="password" />
      <Field form={form} name="rePassword" label="Confirm password" type="password" />
      <button className="btn" disabled={form.loading}>{form.loading ? "Loading..." : "Register"}</button>
      <p className="muted">Already registered? <Link to="/login">Login</Link></p>
    </form>
  );
}
