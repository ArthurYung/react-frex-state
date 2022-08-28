import { getUpdateId } from './updater';

export interface FrexObserver<T> {
  (value: T, updateId: number): void;
}

export type ModuleListeners<M extends Object> = {
  [K in keyof M]?: FrexObserver<M[K]>[];
};

function pushObserverOnList<T>(observer: T, observers: T[]) {
  if (observers.indexOf(observer) > -1) {
    return -1;
  }

  return observers.push(observer);
}

function removeObserverOnList<T>(observer: T, observers: T[]) {
  for (let i = 0; i < observers.length; i++) {
    if (observers[i] === observer) {
      observers.splice(i, 1);
      return true;
    }
  }

  return false;
}

function emitObservers<T>(state: T, observers: FrexObserver<T>[], errorHandler?: any) {
  const updateId = getUpdateId();

  observers.forEach((observer) => {
    try {
      observer(state, updateId);
    } catch (e) {
      errorHandler ? errorHandler(e) : console.error('Emit observer error: ', e);
    }
  });
}

export function createSubscriber<S extends Object, M extends Object>({
  errorHandler,
}: {
  errorHandler?: (e: any) => void;
}) {
  const listeners: FrexObserver<S>[] = [];
  const moduleListeners: ModuleListeners<M> = {};

  function subscribe(observer: FrexObserver<S>) {
    return pushObserverOnList(observer, listeners);
  }

  function subscribeModule<N extends keyof M>(observer: FrexObserver<M[N]>, ns: N) {
    if (!moduleListeners[ns]) {
      moduleListeners[ns] = [];
    }

    return pushObserverOnList(observer, moduleListeners[ns]!);
  }

  function unsubscribe(observer: FrexObserver<S>) {
    return removeObserverOnList(observer, listeners);
  }

  function unsubscribeModule<N extends keyof M>(observer: FrexObserver<M[N]>, ns: N) {
    const subListeners = moduleListeners[ns] || [];
    return removeObserverOnList(observer, subListeners!);
  }

  function clear() {
    listeners.length = 0;
  }

  function clearModule(ns: keyof M) {
    moduleListeners[ns] && (moduleListeners[ns]!.length = 0);
  }

  function hasObserver() {
    return listeners.length > 0;
  }

  function hasObserverModule(ns: keyof M) {
    if (!moduleListeners[ns]) {
      return false;
    }

    return moduleListeners[ns]!.length > 0;
  }

  function emit(state: S) {
    emitObservers(state, listeners, errorHandler);
  }

  function emitModule<N extends keyof M>(state: M[N], ns: N) {
    emitObservers(state, moduleListeners[ns] || [], errorHandler);
  }

  return {
    subscribe,
    subscribeModule,
    unsubscribe,
    unsubscribeModule,
    clear,
    clearModule,
    hasObserver,
    hasObserverModule,
    emit,
    emitModule,
  };
}

export type Subscriber<S, M> = ReturnType<typeof createSubscriber<S, M>>;
