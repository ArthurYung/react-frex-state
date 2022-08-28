import { act, renderHook } from '@testing-library/react';
import { createFrexContext } from '../context';
import { createFrexHook, createModuleFrexHook } from '../hook';

function getFrexHook(options: { keepAlive?: boolean } = {}) {
  const context = createFrexContext({ initState: { count: 1 }, ...options });
  return { useFrexHook: createFrexHook(context), context };
}

function getModuleFrexHook() {
  const context = createFrexContext({
    initState: { count: 1 },
    moduleState: {
      modulename: {
        count: '1',
      },
    },
  });

  return {
    useModuleFrexHook: createModuleFrexHook<{ count: number }, { modulename: { count: string } }>(
      context,
    ),
    context,
  };
}

describe('use hook', () => {
  it('one components', () => {
    const { useFrexHook } = getFrexHook();
    const { result } = renderHook(useFrexHook);
    expect(result.current[0]).toMatchObject({ count: 1 });

    act(() => {
      result.current[1]({ count: 3 });
    });

    expect(result.current[0]).toMatchObject({ count: 3 });
  });

  it('more components', async () => {
    const { useFrexHook } = getFrexHook();
    const { result } = renderHook(useFrexHook);
    const { result: result2 } = renderHook(useFrexHook);

    expect(result.current[0]).toMatchObject({ count: 1 });
    expect(result2.current[0]).toMatchObject({ count: 1 });

    act(() => {
      result.current[1]({ count: 10 });
    });

    expect(result.current[0]).toMatchObject({ count: 10 });
    expect(result2.current[0]).toMatchObject({ count: 10 });
  });

  it('with countext', () => {
    const { useFrexHook, context } = getFrexHook();
    const { result } = renderHook(useFrexHook);
    expect(result.current[0]).toMatchObject({ count: 1 });

    act(() => {
      result.current[1]({ count: 10 });
    });

    expect(result.current[0]).toMatchObject({ count: 10 });

    act(() => {
      context.setState({ count: 20 });
    });

    expect(result.current[0]).toMatchObject({ count: 20 });
  });
});

describe('use modules hook', () => {
  it('one components', () => {
    const { useModuleFrexHook } = getModuleFrexHook();
    const { result } = renderHook(() => useModuleFrexHook('modulename'));
    expect(result.current[0]).toMatchObject({ count: '1' });

    act(() => {
      result.current[1]({ count: '3' });
    });

    expect(result.current[0]).toMatchObject({ count: '3' });
  });

  it('more components', async () => {
    const { useModuleFrexHook } = getModuleFrexHook();
    const { result } = renderHook(() => useModuleFrexHook('modulename'));
    const { result: result2 } = renderHook(() => useModuleFrexHook('modulename'));

    expect(result.current[0]).toMatchObject({ count: '1' });
    expect(result2.current[0]).toMatchObject({ count: '1' });

    act(() => {
      result.current[1]({ count: '10' });
    });

    expect(result.current[0]).toMatchObject({ count: '10' });
    expect(result2.current[0]).toMatchObject({ count: '10' });
  });
});
