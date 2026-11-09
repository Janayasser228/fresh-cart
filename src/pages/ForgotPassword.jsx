import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import Field from "../components/Field";
import useForm from "../hooks/useForm";
import { useToast } from "../context/ToastContext";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const emailForm = useForm(
    { email: "" },
    (v) => (emailRe.test(v.email) ? {} : { email: "Enter a valid email" }),
    async (v) => {
      const { data } = await api.post("/auth/forgotPasswords", v);
      setEmail(v.email);
      toast(data.message || "Code sent to your email");
      setStep(2);
    }
  );

  const codeForm = useForm(
    { resetCode: "" },
    (v) => (v.resetCode.trim().length >= 4 ? {} : { resetCode: "Enter the code" }),
    async (v) => {
      await api.post("/auth/verifyResetCode", { resetCode: v.resetCode.trim() });
      toast("Code verified");
      setStep(3);
    }
  );

  const passForm = useForm(
    { newPassword: "" },
    (v) => (v.newPassword.length >= 6 ? {} : { newPassword: "Password must be at least 6 characters" }),
    async (v) => {
      await api.put("/auth/resetPassword", { email, newPassword: v.newPassword });
      toast("Password changed, please login");
      navigate("/login");
    }
  );

  return (
    <div className="auth-box card">
      <h2>Forgot Password</h2>
      <p className="muted">Step {step} of 3</p>

      {step === 1 && (
        <form onSubmit={emailForm.submit} noValidate>
          {emailForm.apiError && <div className="alert error">{emailForm.apiError}</div>}
          <Field form={emailForm} name="email" label="Your email" type="email" />
          <button className="btn" disabled={emailForm.loading}>{emailForm.loading ? "Sending..." : "Send code"}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={codeForm.submit} noValidate>
          {codeForm.apiError && <div className="alert error">{codeForm.apiError}</div>}
          <Field form={codeForm} name="resetCode" label="Code from your email" />
          <button className="btn" disabled={codeForm.loading}>{codeForm.loading ? "Checking..." : "Verify code"}</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={passForm.submit} noValidate>
          {passForm.apiError && <div className="alert error">{passForm.apiError}</div>}
          <Field form={passForm} name="newPassword" label="New password" type="password" />
          <button className="btn" disabled={passForm.loading}>{passForm.loading ? "Saving..." : "Reset password"}</button>
        </form>
      )}

      <p className="muted"><Link to="/login">Back to login</Link></p>
    </div>
  );
}
