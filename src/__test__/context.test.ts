import { createFrexContext, FrexUseType } from '../context';

function createJestContext(options?: { keepAlive?: boolean; errorHandler?: (e: any) => void }) {
  return createFrexContext({
    initState: {
      count: 0,
    },
    ...options,
  });
}

function createJestModuleContext() {
  return createFrexContext({
    initState: {
      count: 0,
    },
    moduleState: {
      modulename: {
        count: '0',
      },
    },
  });
}

describe('create context instance', () => {
  it('get state', () => {
    const context = createJestContext();
    expect(context.getState()).toMatchObject({ count: 0 });
  });

  it('set state', () => {
    const context = createJestContext();
    context.setState({ count: 1 });
    expect(context.getState()).toMatchObject({ count: 1 });
  });

  it('subscribe', (done) => {
    const context = createJestContext();
    // Emit observers whit setState;
    context.subscribe(() => {
      done();
    });

    context.setState({ count: 1 });
  });

  it('unSubscribe', () => {
    let hasEmitObserver = false;
    const context = createJestContext();
    const observer = () => {
      hasEmitObserver = true;
    };
    context.subscribe(observer);
    context.unsubscribe(observer);
    context.setState({ count: 1 });
    expect(hasEmitObserver).toBeFalsy();
  });

  it('value type', () => {
    const context = createJestContext();
    expect(context.getType()).toBe(FrexUseType.READY);
    context.setState({ count: 1 });
    expect(context.getType()).toBe(FrexUseType.VALUE);
  });
});

describe('context options', () => {
  it('keep alive false', () => {
    /**
     * If keepAlive option is false, context state
     * will be initialized when cleared all observers
     */
    const context = createJestContext({ keepAlive: false });
    const observer = () => {};
    context.subscribe(observer);
    context.setState({ count: 2 });
    expect(context.getState()).toMatchObject({ count: 2 });
    context.unsubscribe(observer);
    expect(context.getState()).toMatchObject({ count: 0 });
  });

  it('keep alive true', () => {
    const context = createJestContext({ keepAlive: true });
    const observer = () => {};
    context.subscribe(observer);
    context.setState({ count: 2 });
    expect(context.getState()).toMatchObject({ count: 2 });
    context.unsubscribe(observer);
    expect(context.getState()).toMatchObject({ count: 2 });
  });

  it('error handler', (done) => {
    const context = createJestContext({ errorHandler: () => done() });
    context.subscribe(() => {
      throw new Error('emit error handler');
    });
    context.setState({ count: 3 });
  });
});

describe('create modules context instance', () => {
  it('get module state', () => {
    const context = createJestModuleContext();
    expect(context.getModuleState('modulename')).toMatchObject({ count: '0' });
  });

  it('set module state', () => {
    const context = createJestModuleContext();
    context.setModuleState('modulename', { count: '1' });
    expect(context.getModuleState('modulename')).toMatchObject({ count: '1' });
  });

  it('subscribe module', (done) => {
    const context = createJestModuleContext();
    // Emit observers whit setState;
    context.subscribeModule(() => {
      done();
    }, 'modulename');

    context.setModuleState('modulename', { count: '1' });
  });

  it('unSubscribe module', () => {
    let hasEmitObserver = false;
    const context = createJestModuleContext();
    const observer = () => {
      hasEmitObserver = true;
    };
    context.subscribeModule(observer, 'modulename');
    context.unsubscribeModule(observer, 'modulename');
    context.setModuleState('modulename', { count: '1' });
    expect(hasEmitObserver).toBeFalsy();
  });
});
