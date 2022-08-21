import { createFrexContext } from './state';

export function createFrexState<S extends Object>(initState?: S) {
  const state = createFrexContext(initState);
}
