export default function useVal<T>(fn: () => T) {
  return fn();
}
