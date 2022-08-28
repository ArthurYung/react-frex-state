import { useEffect, useState } from 'react';
import { FrexContext } from './context';

export function createFrexHook<S extends Object, M extends Object>(context: FrexContext<S, M>) {
  return (): [S, (state: Partial<S>) => void] => {
    const [, forceUpdate] = useState(0);
    const [frexState, setFrexState] = useState(context.getState());

    useEffect(() => {
      const unsubscribe = context.subscribe((state, updateId) => {
        setFrexState(state);
        forceUpdate(updateId);
      });

      return () => unsubscribe();
    }, []);

    return [frexState, context.setState];
  };
}

export function createModuleFrexHook<S extends Object, M extends Object>(
  context: FrexContext<S, M>,
) {
  return <N extends keyof M>(namespace: N): [M[N], (state: Partial<M[N]>) => void] => {
    const [, forceUpdate] = useState(0);
    const [frexState, setFrexState] = useState(context.getModuleState(namespace));

    function setState(data: Partial<M[N]>) {
      return context.setModuleState(namespace, data);
    }

    useEffect(() => {
      const unsubscribe = context.subscribeModule((state, updateId) => {
        setFrexState(state);
        forceUpdate(updateId);
      }, namespace);

      return () => unsubscribe();
    }, []);

    return [frexState, setState];
  };
}
