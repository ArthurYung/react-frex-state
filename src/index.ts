import { createFrexHook } from './hook';
import { createFrexContext } from './context';

export function createFrexState<S extends Object>({
  initState,
  keepAlive = true,
}: {
  initState?: S;
  keepAlive?: boolean;
}) {
  const context = createFrexContext(initState, keepAlive);
  const useFrexState = createFrexHook(context);

  return {
    context,
    useFrexState,
  };
}
