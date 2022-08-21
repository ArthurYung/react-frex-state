import { useEffect, useRef, useState } from 'react';
import { FrexContext, FrexUseType } from './state';

export function createFrexHook<S extends FrexContext<any>>(state: S) {
  return (resetState?: S) => {
    const [, forceUpdate] = useState(0);
    const frexStateRef = useRef<S>(state.getValue());

    useEffect(() => {
      const watcher = (newState: S, updateId: number) => {
        frexStateRef.current = newState;
        forceUpdate(updateId);
      };

      if (resetState && state.getType() === FrexUseType.READY) {
        frexStateRef.current = resetState;
        state.setValue(resetState);
      }

      return () => {};
    }, []);

    return [frexStateRef.current, state.setValue];
  };
}
