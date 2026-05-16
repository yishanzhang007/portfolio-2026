"use client";

import { useEffect, useRef, useState } from "react";

/* Returns a counter that bumps every time `visible` flips false → true.
   Use as a React `key` on elements whose entrance animation should
   replay on each new hover instead of only on first mount. */
export function useReplayKey(visible: boolean) {
  const [key, setKey] = useState(0);
  const wasVisible = useRef(visible);
  useEffect(() => {
    if (visible && !wasVisible.current) {
      setKey((k) => k + 1);
    }
    wasVisible.current = visible;
  }, [visible]);
  return key;
}
