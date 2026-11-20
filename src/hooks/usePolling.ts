import { useEffect, useRef } from "react";
export function usePolling(callback: () => void, interval = 3000) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(() => {
    const id = setInterval(() => ref.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
}
