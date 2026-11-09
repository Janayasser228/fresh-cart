import { useState } from "react";
import { errMsg } from "../api";

// Hook للفورمات: بيدير القيم + الvalidation + الloading + رسالة الerror من الAPI
export default function useForm(initial, validate, onSubmit) {
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const allErrors = validate(values);
  const errors = {};
  Object.keys(allErrors).forEach((k) => {
    if (touched[k] || submitted) errors[k] = allErrors[k];
  });

  const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const onBlur = (e) => setTouched({ ...touched, [e.target.name]: true });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    if (Object.keys(allErrors).length) return;
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setApiError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return { values, errors, onChange, onBlur, submit, loading, apiError, setValues };
}
