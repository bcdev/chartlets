import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/plugins/mui/Skeleton";

describe("Skeleton", () => {
  it("should render the MUI Skeleton when loading is true", () => {
    render(<Skeleton loading height={10} />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toBeInTheDocument();
    expect(muiSkeleton).toHaveClass("MuiSkeleton-root");
  });

  it("should not render the MUI Skeleton without skeletonProps", () => {
    render(<Skeleton loading />);
    const muiSkeleton = screen.queryByTestId("skeleton-test-id");
    expect(muiSkeleton).not.toBeInTheDocument();
  });

  it("should not render the MUI Skeleton and render children when loading is false", () => {
    render(
      <Skeleton loading={false} height={10}>
        <div>Test Content</div>
      </Skeleton>,
    );
    const muiSkeleton = screen.queryByTestId("skeleton-test-id");
    expect(muiSkeleton).not.toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render with the specified variant", () => {
    render(<Skeleton loading variant="circular" />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveClass("MuiSkeleton-circular");
  });

  it("should render with specified width and height", () => {
    render(<Skeleton loading width={100} height={50} />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveStyle("width: 100px");
    expect(muiSkeleton).toHaveStyle("height: 50px");
  });

  it("should render with specified style", () => {
    render(<Skeleton loading style={{ backgroundColor: "red" }} height={10} />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveStyle("background-color: rgb(255, 0, 0);");
  });

  it("should render with specified animation", () => {
    render(<Skeleton loading animation="wave" />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveClass("MuiSkeleton-wave");
  });
});
