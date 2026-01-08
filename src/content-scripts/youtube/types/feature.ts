export interface Feature {
  match: (path: string) => boolean;
  init?: () => void | (() => void) | Promise<() => void>;
  destroy?: () => void;
}
