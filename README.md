# react-frex-state

A painless react state library. [Document](https://arthuryung.github.io/react-frex-state/)

[![codecov](https://codecov.io/gh/ArthurYung/react-frex-state/branch/master/graph/badge.svg?token=VYQG6SBSEZ)](https://codecov.io/gh/ArthurYung/react-frex-state) [![npm](https://img.shields.io/npm/v/react-frex-state)](https://www.npmjs.com/package/react-frex-state) [![listener](https://img.shields.io/github/license/ArthurYung/react-frex-state)](https://github.com/ArthurYung/react-frex-state/blob/master/LICENSE)

## Useage

Install library

```bash
$ npm i react-frex-state
```

Create a Frex State

```ts
// store/example.ts
import { createFrexState } from 'react-frex-state';
const { context, useState } = createFrexState({
  initState: {
    foo: 0,
  },
});

export const useExampleState = useState;
export const exampleContext = context;
```

Use state with hooks

```tsx
// components/Demo.tsx
import { useExampleState } from 'store/example';

const Demo = () => {
  const [state, setState] = useExampleState();

  return <span>{state.foo}</span>;
};
```

Use state whit context

```ts
import { exampleContext } from 'store/example';

exampleContext.setState({ foo: 3 });
```

## Develop

Install dependencies

```bash
$ npm i
```

Start the dev server,

```bash
$ npm start
```

Build documentation,

```bash
$ npm run docs:build
```

Run test,

```bash
$ npm test
```

Build library via `father`,

```bash
$ npm run build
```
