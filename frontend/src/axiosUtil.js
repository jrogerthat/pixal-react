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
  
    return { data, error, loaded };
  };

async function useGetDistributions(){

  let data = await axios.get('/get_pred_dis')
 
  return data;
}

async function useGetAxiosAsync(url){
  console.log(url)
  let data = await axios.get(url)
 

  return data;
}



// THIS THROWS A 505 ERROR
// {"State": ["Vermont"], "Segment": ["Corporate"]}
// precipitation=[1, 10],"Segment"=["Corporate"]
async function useAddPredicate (dataOb){

  // const [data, setData] = useState(null);
  // const [error, setError] = useState("");
  // const [loaded, setLoaded] = useState(false);
 
  // useEffect(() => {
  //   axios  
  //     .post('/add_predicate', JSON.stringify(dataOb), {headers:{"Content-Type" : "application/json"}})
  //     .then((response) => setData(response.data))
  //     .catch((error) => setError(error.message))
  //     .finally(() => setLoaded(true));

  // }, []);

  // return { data, error, loaded };
  let data = await axios.post('/add_predicate', JSON.stringify(dataOb), {headers:{"Content-Type" : "application/json"}})
  

  return data;
}

export {useAxiosGet, useAddPredicate, useGetDistributions, useGetAxiosAsync}

