import api from "../api";
import Field from "../components/Field";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ChangePassword() {
  const { login } = useAuth();
  const toast = useToast();

  const form = useForm(
    { currentPassword: "", password: "", rePassword: "" },
    (v) => {
      const e = {};
      if (!v.currentPassword) e.currentPassword = "Enter your current password";
      if (v.password.length < 6) e.password = "Password must be at least 6 characters";
      if (v.rePassword !== v.password) e.rePassword = "Passwords do not match";
      return e;
    },
    async (v) => {
      const { data } = await api.put("/users/changeMyPassword", v);
      if (data.token) login(data.token); // السيرفر بيرجع توكن جديد
      toast("Password changed successfully");
      form.setValues({ currentPassword: "", password: "", rePassword: "" });
    }
  );

  return (
    <form className="auth-box card" onSubmit={form.submit} noValidate>
      <h2>Change Password</h2>
      {form.apiError && <div className="alert error">{form.apiError}</div>}
      <Field form={form} name="currentPassword" label="Current password" type="password" />
      <Field form={form} name="password" label="New password" type="password" />
      <Field form={form} name="rePassword" label="Confirm new password" type="password" />
      <button className="btn" disabled={form.loading}>{form.loading ? "Saving..." : "Change password"}</button>
    </form>
  );
}
