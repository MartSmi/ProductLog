import {useState, useEffect} from "react";

export const getUrl = url => new URL(url, process.env.REACT_APP_URL_API).toString();

function useFetch(url, skip) {
  const [data, setData] = useState({});

  useEffect( () => {
    const abortController = new AbortController();

    async function fetchData() {
      const fullUrl = getUrl(url);
      console.log('Fetching from: ' + fullUrl);
      try {
        const response = await fetch(fullUrl, {
          signal: abortController.signal,
        });

        if (response.ok) {
          console.log('Response received from server and is ok!')
          const res = await response.json();

          if (abortController.signal.aborted) {
            console.log('Abort detected, exiting!')
            return;
          }

          setData(res)
        }
      } catch(e) {
        console.log(e)
      }
    }

    !skip && fetchData()

    return () => {
      console.log('Aborting GET request.')
      abortController.abort();
    }
  }, [url, setData, skip])

  return data
}

export default useFetch
