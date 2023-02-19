import { useEffect, useState } from "react";
import axios from "axios";

const useAxiosGet = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      axios
        .get(url)
        .then((response) => setData(response.data))
        .catch((error) => setError(error.message))
        .finally(() => setLoaded(true));
    }, []);
  
    return { data };
  }



// THIS THROWS A 505 ERROR
// {"State": ["Vermont"], "Segment": ["Corporate"]}
const addPredicate = (dataOb, url) => {
  
  console.log(dataOb);
  // useEffect(() => {
  axios  
    .post(url, JSON.stringify(dataOb), {headers:{"Content-Type" : "application/json"}})
    .then((response) => console.log(response))
    .catch((error) => console.log(error.response))
    // .finally(() => setLoaded(true));
  // }, []);

}

export {useAxiosGet, addPredicate}

