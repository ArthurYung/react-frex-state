import { createSubscriber, FrexObserver } from './subscriber';

export enum FrexUseType {
  READY,
  VALUE,
}

export interface ContextOptions<S extends Object, M extends Object> {
  initState?: S;
  keepAlive?: boolean;
  errorHandler?: (e: any) => void;
  moduleState?: M;
}

export function createFrexContext<S extends Object, M extends Object>({
  initState = {} as S,
  keepAlive = true,
  moduleState = {} as M,
  errorHandler,
}: ContextOptions<S, M>) {
  const context = {
    value: {
      ...initState,
    },
    useType: FrexUseType.READY,
    modules: {
      ...moduleState,
    },
    subscriber: createSubscriber<S, M>({
      errorHandler,
    }),
  };

  function getState() {
    return context.value;
  }

  function getModuleState<T extends keyof M>(namespace: T) {
    return context.modules[namespace];
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

  function setModuleState<T extends keyof M>(namespace: T, state: Partial<M[T]>) {
    context.modules[namespace] = {
      ...context.modules[namespace],
      ...state,
    };

    context.subscriber.emitModule(context.modules[namespace], namespace);
  }

  function subscribe(observer: FrexObserver<S>) {
    context.subscriber.subscribe(observer);
    return () => unsubscribe(observer);
  }

  function subscribeModule<N extends keyof M>(observer: FrexObserver<M[N]>, ns: N) {
    context.subscriber.subscribeModule(observer, ns);
    return () => unsubscribeModule(observer, ns);
  }

  function unsubscribe(observer: FrexObserver<S>) {
    context.subscriber.unsubscribe(observer);

    if (!keepAlive && !context.subscriber.hasObserver()) {
      context.value = { ...initState };
      context.useType = FrexUseType.READY;
    }
  }

  function unsubscribeModule<N extends keyof M>(observer: FrexObserver<M[N]>, ns: N) {
    context.subscriber.unsubscribeModule(observer, ns);

    if (!keepAlive && !context.subscriber.hasObserverModule(ns)) {
      context.modules[ns] = {
        ...moduleState[ns],
      };
    }
  }

  return {
    getState,
    getType,
    setState,
    subscribe,
    unsubscribe,
    getModuleState,
    setModuleState,
    subscribeModule,
    unsubscribeModule,
  };
}

export type FrexContext<S, M> = ReturnType<typeof createFrexContext<S, M>>;
