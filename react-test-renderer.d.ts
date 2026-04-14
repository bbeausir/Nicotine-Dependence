declare module 'react-test-renderer' {
  import type * as React from 'react';

  export type ReactTestInstance = {
    type: unknown;
    props: any;
    children: Array<ReactTestInstance | string>;
    findAllByType(type: unknown): ReactTestInstance[];
    findByProps(props: any): ReactTestInstance;
  };

  export type ReactTestRenderer = {
    root: ReactTestInstance;
    unmount(): void;
  };

  export function act(callback: () => void | Promise<void>): Promise<void>;
  export function create(element: React.ReactElement): ReactTestRenderer;
}
