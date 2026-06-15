import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError("");
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;
