import { useState } from "react";
import { useUpdateEffect } from "react-use";

export const useMoEffect = (
  fn: React.EffectCallback,
  deps: React.DependencyList
) => {
  useState(() => {
    fn();
  });
  useUpdateEffect(fn, deps);
};
