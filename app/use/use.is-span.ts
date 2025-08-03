import { useMediaQuery } from "react-responsive";

export const useIsSpan = () => {
  const result = {
    xs: useMediaQuery({ query: '(max-width: 480px)' }),
    sm: useMediaQuery({ query: '(max-width: 768px)' }),
    md: useMediaQuery({ query: '(max-width: 992px)' }),
    lg: useMediaQuery({ query: '(max-width: 1200px)' }),
    xl: useMediaQuery({ query: '(max-width: 1600px)' }),
    xxl: true
  }
  return result;
};
