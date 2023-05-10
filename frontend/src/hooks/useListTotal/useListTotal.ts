import { useEffect, useState } from 'react';

export const useListTotal = (total: number | undefined) => {
  const [nonEmptyTotal, setNonEmptyTotal] = useState<number>(total ?? 0);

  useEffect(() => {
    if (total !== undefined) {
      setNonEmptyTotal(total);
    }
  }, [total]);

  return nonEmptyTotal;
};
