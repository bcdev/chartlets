import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/plugins/mui/Skeleton";

describe("Skeleton", () => {
  it("should render the MUI Skeleton when loading is true", () => {
    render(<Skeleton isLoading height={10} />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toBeInTheDocument();
    expect(muiSkeleton).toHaveClass("MuiSkeleton-root");
  });

  it("should not render the MUI Skeleton and render children when loading is false", () => {
    render(
      <Skeleton isLoading={false} height={10}>
        <div>Test Content</div>
      </Skeleton>,
    );
    const muiSkeleton = screen.queryByTestId("skeleton-test-id");
    expect(muiSkeleton).not.toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("should render with the specified variant", () => {
    render(<Skeleton isLoading variant="circular" />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveClass("MuiSkeleton-circular");
  });

  it("should render with specified width and height", () => {
    render(<Skeleton isLoading width={100} height={50} />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveStyle("width: 100px");
    expect(muiSkeleton).toHaveStyle("height: 50px");
  });

  it("should render with specified animation", () => {
    render(<Skeleton isLoading animation="wave" />);
    const muiSkeleton = screen.getByTestId("skeleton-test-id");
    expect(muiSkeleton).toHaveClass("MuiSkeleton-wave");
  });
});
