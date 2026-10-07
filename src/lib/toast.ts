let listeners: ((msg: string) => void)[] = [];

export function toast(message: string) {
  listeners.forEach((l) => l(message));
}

export function subscribeToasts(l: (msg: string) => void): () => void {
  listeners.push(l);
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
}