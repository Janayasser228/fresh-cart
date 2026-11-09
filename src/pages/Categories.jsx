import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { ErrorBox, Loader } from "../components/Loader";

export default function Categories() {
  const { data, loading, error } = useFetch("/categories");
  const subs = useFetch("/subcategories", { limit: 100 });
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  return (
    <>
      <h2>All Categories</h2>
      <div className="grid tiles">
        {data.data.map((c) => (
          <Link key={c._id} to={`/categories/${c._id}`} className="card tile">
            <img src={c.image} alt={c.name} className="tall" />
            <b>{c.name}</b>
          </Link>
        ))}
      </div>

      {subs.data && (
        <section>
          <h2>Browse Subcategories</h2>
          <div className="chips">
            {subs.data.data.map((s) => (
              <Link key={s._id} to={`/categories/${s.category}`} className="chip">{s.name}</Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
