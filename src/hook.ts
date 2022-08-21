import { useEffect, useRef, useState } from 'react';
import { FrexContext } from './context';

export function createFrexHook<S extends FrexContext<any>>(context: S) {
  return () => {
    const [, forceUpdate] = useState(0);
    const frexStateRef = useRef<S>(context.getState());

    useEffect(() => {
      const unsubscribe = context.subscribe((state, updateId) => {
        frexStateRef.current = state;
        forceUpdate(updateId);
      });

      return () => unsubscribe();
    }, []);

    return [frexStateRef.current, context.setState];
  };
}
