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
  loading: boolean;
  children?: ReactElement;
}

interface SkeletonProps extends SkeletonState {}

export const Skeleton = ({
  id,
  style,
  loading,
  children,
  ...skeletonProps
}: SkeletonProps) => {
  return loading && skeletonProps && Object.keys(skeletonProps).length > 0 ? (
    <MuiSkeleton
      id={id}
      style={style}
      {...skeletonProps}
      data-testid="skeleton-test-id"
    />
  ) : (
    children
  );
};
