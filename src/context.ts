import { createSubscriber, FrexObserver } from './subscriber';

export enum FrexUseType {
  READY,
  VALUE,
}

export interface ContextOptions<S extends Object> {
  initState?: S;
  keepAlive?: boolean;
  errorHandler?: (e: any) => void;
}

export function createFrexContext<S extends Object>({
  initState = {} as S,
  keepAlive = true,
  errorHandler,
}: ContextOptions<S>) {
  const context = {
    value: initState,
    useType: FrexUseType.READY,
    subscriber: createSubscriber<S>({
      errorHandler,
    }),
  };

  function getState() {
    return context.value;
  }

  function getType() {
    return context.useType;
  }

  function setState(state: Partial<S>) {
    context.value = {
      ...context.value,
      ...state,
    };

    context.useType = FrexUseType.VALUE;
    context.subscriber.emit(context.value);
  }

  function subscribe(observer: FrexObserver<S>) {
    context.subscriber.subscribe(observer);
    return () => unsubscribe(observer);
  }

  function unsubscribe(observer: FrexObserver<S>) {
    context.subscriber.unsubscribe(observer);

    if (!keepAlive && !context.subscriber.hasObserver()) {
      context.value = { ...initState };
      context.useType = FrexUseType.READY;
    }
  }

  return {
    getState,
    getType,
    setState,
    subscribe,
    unsubscribe,
  };
}

export type FrexContext<S> = ReturnType<typeof createFrexContext<S>>;
