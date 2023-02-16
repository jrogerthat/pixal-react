import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosGet = (url) => {
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
  }

// THIS THROWS A 505 ERROR
// {"State": ["Vermont"], "Segment": ["Corporate"]}
const addPredicate = (dataOb) => {
  
  console.log(dataOb);
  // useEffect(() => {
  axios  
    .post('/add_predicate', JSON.stringify(dataOb), {headers:{"Content-Type" : "application/json"}})
    .then((response) => console.log(response))
    .catch((error) => console.log(error.response))
    // .finally(() => setLoaded(true));
  // }, []);

}

export {useAxiosGet, addPredicate}

