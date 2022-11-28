import { useState, useEffect } from "react";

function useSWIsReady() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    window.navigator.serviceWorker.ready.then(() => {
      setShow(true);
    });
  }, []);
  return show;
}

export default useSWIsReady;
