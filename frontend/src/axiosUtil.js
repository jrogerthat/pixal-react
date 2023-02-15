import { useEffect, useState } from "react";
import axios from "axios";

export const useAxiosGet = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      axios
        .get(url)
        .then((response) => setData(Object.entries(response.data)))
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    }, []);
  
    return { data, error, loaded };
  };


