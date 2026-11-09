import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { PagedProducts } from "../components/ProductCard";
import { ErrorBox, Loader } from "../components/Loader";

export default function BrandDetails() {
  const { id } = useParams();
  const { data, loading, error } = useFetch(`/brands/${id}`);
  if (loading) return <Loader />;
  if (error) return <ErrorBox message={error} />;
  const b = data.data;
  return (
    <>
      <div className="card hero-mini">
        <img src={b.image} alt={b.name} />
        <h1>{b.name}</h1>
      </div>
      <h2>Products by {b.name}</h2>
      <PagedProducts extra={{ brand: id }} />
    </>
  );
}
