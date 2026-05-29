import { useEffect, useRef, useState } from "react";

type Options = {
  chunkSize?: number; // chars per tick
  intervalMs?: number;
};

export function useTypewriter(
  fullText: string,
  active: boolean,
  options: Options = {},
) {
  const { chunkSize = 4, intervalMs = 35 } = options;
  const [displayed, setDisplayed] = useState("");
  const idxRef = useRef(0);

  useEffect(() => {
    if (!active) return;
    idxRef.current = 0;
    setDisplayed("");
    const id = window.setInterval(() => {
      idxRef.current += chunkSize;
      if (idxRef.current >= fullText.length) {
        setDisplayed(fullText);
        clearInterval(id);
        return;
      }
      setDisplayed(fullText.slice(0, idxRef.current));
    }, intervalMs);
    return () => clearInterval(id);
  }, [fullText, active, chunkSize, intervalMs]);

  return { displayed, done: displayed === fullText };
}
