import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { ErrorBox, Loader } from "../components/Loader";

export default function Brands() {
  const { data, loading, error } = useFetch("/brands", { limit: 100 });
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  return (
    <>
      <h2>All Brands</h2>
      <div className="grid tiles">
        {data.data.map((b) => (
          <Link key={b._id} to={`/brands/${b._id}`} className="card tile">
            <img src={b.image} alt={b.name} />
            <b>{b.name}</b>
          </Link>
        ))}
      </div>
    </>
  );
}
