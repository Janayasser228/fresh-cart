import { useEffect, useState } from "react";
import api, { errMsg } from "../api";

// Hook بسيط لجلب البيانات: بيرجع { data, loading, error }
export default function useFetch(url, params) {
  const [state, setState] = useState({ data: null, loading: !!url, error: null });
  const key = JSON.stringify([url, params]);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    api
      .get(url, { params })
      .then((res) => !cancelled && setState({ data: res.data, loading: false, error: null }))
      .catch((e) => !cancelled && setState({ data: null, loading: false, error: errMsg(e) }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line
  }, [key]);

  return state;
}
