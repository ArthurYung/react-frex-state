import { createSubscriber } from '../subscriber';

// Define a test type
type Foo = {
  count: number;
};

describe('create subscriber instance', () => {
  it('hasObserver', () => {
    const subscriber = createSubscriber<Foo>({});
    expect(subscriber.hasObserver()).toBeFalsy();
    subscriber.subscribe(() => {});
    expect(subscriber.hasObserver()).toBeTruthy();
  });

  it('subscribe & unsubscribe', () => {
    const subscriber = createSubscriber<Foo>({});
    const observer = () => {};
    subscriber.subscribe(observer);

    // Duplicate subscribe will fail
    subscriber.subscribe(observer);

    // Do not anything when unsubscribe nonexistent observer
    subscriber.unsubscribe(() => {});

    expect(subscriber.hasObserver()).toBeTruthy();
    subscriber.unsubscribe(observer);
    expect(subscriber.hasObserver()).toBeFalsy();
  });

  it('clear', () => {
    const subscriber = createSubscriber<Foo>({});
    subscriber.subscribe(() => {});
    subscriber.subscribe(() => {});
    expect(subscriber.hasObserver()).toBeTruthy();

    // Clear all observers
    subscriber.clear();
    expect(subscriber.hasObserver()).toBeFalsy();
  });

  it('emit state', () => {
    let emitState: Foo | null = null;
    const subscriber = createSubscriber<Foo>({});
    const observer = (state: Foo) => {
      emitState = state;
    };

    subscriber.subscribe(observer);
    subscriber.emit({ count: 1 });
    expect(emitState).toMatchObject({ count: 1 });
  });

  it('emit all & updateId', () => {
    const emitState = { count: 2 };
    const subscriber = createSubscriber<Foo>({});

    // Subscribe two data check if they are equal
    let result1: Foo | null = null;
    let resultId1 = 0;
    subscriber.subscribe((state, id) => {
      result1 = state;
      resultId1 = id;
    });

    let result2: Foo | null = null;
    let resultId2 = 0;
    subscriber.subscribe((state, id) => {
      result2 = state;
      resultId2 = id;
    });

    subscriber.emit(emitState);

    expect(result1 === result2).toBeTruthy();
    expect(resultId1 === resultId2).toBeTruthy();
  });

  it('updateId changed', () => {
    let prevId = 0;
    let currId = prevId;
    const subscriber = createSubscriber<Foo>({});
    subscriber.subscribe((_, id) => {
      currId = id;
    });

    subscriber.emit({ count: 1 });
    // Get first updateId in this describer
    prevId = currId;

    subscriber.emit({ count: 1 });
    expect(currId - prevId).toBe(1);

    // Reset prev updateId and test again
    prevId = currId;
    subscriber.emit({ count: 1 });
    expect(currId - prevId).toBe(1);
  });
});

describe('error handler', () => {
  function createErrorEmit(error: Error, errorHandler?: (e: any) => void) {
    const subscriber = createSubscriber<Foo>({ errorHandler });
    subscriber.subscribe(() => {
      throw error;
    });

    subscriber.emit({ count: 2 });
  }

  it('use default console error', () => {
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
    createErrorEmit(new Error('emit error'));
    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
  });

  it('use error handler', (done) => {
    createErrorEmit(new Error('emit error'), (err) => {
      expect(err.message).toBe('emit error');
      done();
    });
  });
});
