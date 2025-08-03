import React, { ComponentType, lazy, Suspense } from "react";

export function utilLazyView<T>(fn:()=>Promise<ComponentType<T>>){
    let MyComponent = lazy(async () => {
        const myDefault = await fn();
        return { default:myDefault };
        });
    const MemoizeMyComponent = React.memo(MyComponent);
    type MyComponentPropsType = React.ComponentProps<typeof MyComponent>;
    const SuspenseMemo = (props:MyComponentPropsType)=>{
        return  <Suspense>
        <MemoizeMyComponent {...props as any}/>
      </Suspense>
    }
    return SuspenseMemo
}

