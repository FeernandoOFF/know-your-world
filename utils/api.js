import axios from 'axios';
import { useState, useEffect } from 'react';

export const useGetSingleCountry = (name) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { data } = await axios(
        'https://en.wikipedia.org/api/rest_v1/page/summary/' + name
      );
      console.log('Country', data);
      setData(data);
    }
    fetchData();
  }, []);

  // let c = axios('https://en.wikipedia.org/api/rest_v1/page/summary/' + name);

  return [data, isLoading];
};
