import { type ComponentChangeHandler } from "@/types/state/event";
import { registry } from "@/components/registry";

export interface ComponentProps {
  type: string;
  onChange: ComponentChangeHandler;
}

export function Component(props: ComponentProps) {
  const { type: componentType } = props;
  const ActualComponent = registry.lookup(componentType);
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
}
