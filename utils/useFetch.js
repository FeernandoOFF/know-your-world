import { useState, useEffect } from 'react';

async function useFetch(url) {
  const [isLoading, setIsLoading] = useState(false);

  let data = fetch(url)
    .then((data) => data.json())
    .then((data) => {
      return [data, isLoading];
    });
}

export default useFetch;
