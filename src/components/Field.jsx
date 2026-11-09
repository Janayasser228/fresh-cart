// حقل إدخال عام: بياخد form (الناتج من useForm) و name
export default function Field({ form, name, label, type = "text", placeholder }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={form.values[name]}
        onChange={form.onChange}
        onBlur={form.onBlur}
        className={form.errors[name] ? "invalid" : ""}
      />
      {form.errors[name] && <small className="err">{form.errors[name]}</small>}
    </div>
  );
}
