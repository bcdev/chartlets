import { type FC } from "react";
import { isString } from "@/utils/isString";
import { registry } from "@/components/registry";
import type { ComponentProps } from "@/types/state/plugin";

export const Component: FC<ComponentProps> = (props: ComponentProps) => {
  const ActualComponent = isString(props.type) && registry.lookup(props.type);
  if (typeof ActualComponent === "function") {
    // eslint-disable-next-line react-hooks/static-components
    return <ActualComponent {...props} />;
  } else {
    // We no longer log, as the situation is quite common
    // and users can not do anything against it.
    // Enable error logging for debugging only:
    // console.error(
    //  `chartlets: invalid component type encountered: ${componentType}`,
    // );
    return null;
  }
};
