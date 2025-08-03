import { useDebounce as useDeb } from "use-debounce"
export const useDebounce = <T>(val: T, delay = 500) => {
    return useDeb(val, delay)[0]
}