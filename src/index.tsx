import { createFrexHook, createModuleFrexHook } from './hook';
import { ContextOptions, createFrexContext } from './context';

export function createFrexState<S extends Object, M extends Object>(options: ContextOptions<S, M>) {
  const context = createFrexContext(options);
  const useState = createFrexHook(context);
  const useModuleState = createModuleFrexHook(context);

  return {
    context,
    useState,
    useModuleState,
  };
}
