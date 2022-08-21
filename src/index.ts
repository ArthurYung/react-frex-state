import { createFrexHook } from './hook';
import { ContextOptions, createFrexContext } from './context';

export function createFrexState<S extends Object>(options: ContextOptions<S>) {
  const context = createFrexContext(options);
  const useFrexState = createFrexHook(context);

  return {
    context,
    useFrexState,
  };
}
