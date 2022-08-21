export enum FrexUseType {
  READY,
  VALUE,
}

export interface FrexContext<S extends Object> {
  init: () => void;
  getValue: () => S;
  setValue: (data: S) => void;
  getType: () => FrexUseType;
}

export function createFrexContext<S extends Object>(initState = {} as S): FrexContext<S> {
  const context = {
    value: initState,
    useType: FrexUseType.READY,
    subs: [],
  };

  function getValue() {
    return context.value;
  }

  function getType() {
    return context.useType;
  }

  function setValue(state: Partial<S>) {
    context.value = {
      ...context.value,
      ...state,
    };

    context.useType = FrexUseType.VALUE;
  }

  function init() {
    if (context.subs.length) {
      return;
    }

    context.value = { ...initState };
    context.useType = FrexUseType.READY;
    context.subs = [];
  }

  return {
    getValue,
    getType,
    setValue,
    init,
  };
}
