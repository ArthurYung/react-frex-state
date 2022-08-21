import { getUpdateId } from './updater';

export interface FrexObserver<T> {
  (value: T, updateId: number): void;
}

export function createSubscriber<S extends Object>({
  errorHandler,
}: {
  errorHandler?: (e: any) => void;
}) {
  const listeners: FrexObserver<S>[] = [];

  function subscribe(observer: FrexObserver<S>) {
    if (listeners.indexOf(observer) > -1) {
      return -1;
    }

    return listeners.push(observer);
  }

  function unsubscribe(observer: FrexObserver<S>) {
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i] === observer) {
        listeners.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  function clear() {
    listeners.length = 0;
  }

  function hasObserver() {
    return listeners.length > 0;
  }

  function emit(state: S) {
    const updateId = getUpdateId();
    listeners.forEach((observer) => {
      try {
        observer(state, updateId);
      } catch (e) {
        errorHandler ? errorHandler(e) : console.error('Emit observer error: ', e);
      }
    });
  }

  return {
    subscribe,
    unsubscribe,
    clear,
    hasObserver,
    emit,
  };
}

export type Subscriber<S> = ReturnType<typeof createSubscriber<S>>;
