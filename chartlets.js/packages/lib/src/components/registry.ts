import type { ComponentType } from "react";

import type { ComponentProps } from "@/components/Component";

export type ComponentRegistration =
  | ComponentType<Record<string, unknown>>
  | ComponentType<ComponentProps>;

/**
 * A registry for Chartlets components.
 */
export interface Registry {
  /**
   * Register a React component that renders a Chartlets component.
   *
   * `component` can be any React component. However, if you want to register
   * a custom, reactive component, then `component` must be of type
   * `ComponentType<ComponentProps>` where a `ComponentProps` has at
   * least the following two properties:
   *
   *   - `type: string`: your component's type name.
   *      This will be the same as the `type` used for registration.
   *   - `onChange: ComponentChangeHandler`: an event handler
   *     that your component may call to signal change events.
   *
   * Both props are always be present plus. The component may also
   * be passed any other props provided by the contribution.
   *
   * @param type The Chartlets component's unique type name.
   * @param component A functional React component.
   */
  register(type: string, component: ComponentRegistration): () => void;

  /**
   * Lookup the component of the provided type.
   *
   * @param type The Chartlets component's type name.
   */
  lookup(type: string): ComponentRegistration | undefined;

  /**
   * Clears the registry.
   * For testing only.
   */
  clear(): void;

  /**
   * Get the type names of all registered components.
   */
  types: string[];
}

// export for testing only
export class RegistryImpl implements Registry {
  private components = new Map<string, ComponentRegistration>();

  register(type: string, component: ComponentRegistration): () => void {
    const oldComponent = this.components.get(type);
    this.components.set(type, component);
    return () => {
      if (typeof oldComponent === "function") {
        this.components.set(type, oldComponent);
      } else {
        this.components.delete(type);
      }
    };
  }

  lookup(type: string): ComponentRegistration | undefined {
    return this.components.get(type);
  }

  clear() {
    this.components.clear();
  }

  get types(): string[] {
    return Array.from(this.components.keys());
  }
}

/**
 * The Chartlets component registry.
 *
 * Use `registry.register("C", C)` to register your own component `C`.
 */
export const registry = new RegistryImpl();
