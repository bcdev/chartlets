import {
  Skeleton as MuiSkeleton,
  type SkeletonProps as MuiSkeletonProps,
} from "@mui/material";

import type { ComponentState } from "@/index";
import type { ReactElement } from "react";

interface SkeletonState extends Omit<ComponentState, "type" | "children"> {
  variant?: MuiSkeletonProps["variant"];
  width?: MuiSkeletonProps["width"];
  height?: MuiSkeletonProps["height"];
  animation?: MuiSkeletonProps["animation"];
  opacity?: number;
  isLoading: boolean;
  children?: ReactElement;
}

export interface SkeletonProps extends SkeletonState {}

export const Skeleton = ({
  id,
  style,
  children,
  isLoading,
  ...props
}: SkeletonProps) => {
  // Set default values if not available
  const opacity: number = props.opacity ?? 0.7;
  props.width = props.width ?? "100%";
  props.height = props.height ?? "100%";

  return (
    <div style={{ position: "relative", ...style }} id={id}>
      {children}
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: `rgba(255, 255, 255, ${opacity})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <MuiSkeleton
            id={id}
            style={{ transform: "none" }}
            {...props}
            data-testid="skeleton-test-id"
          />
        </div>
      )}
    </div>
  );
};
