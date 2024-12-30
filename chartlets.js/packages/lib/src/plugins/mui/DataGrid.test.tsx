import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DataGrid } from "./DataGrid";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("DataGrid", () => {
  const mockColumns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name" },
  ];
  const mockRows = [{ id: 1, name: "MockRow" }];
  const paginationModel = { page: 1, pageSize: 10 };

  it("should render the DataGrid component", () => {
    render(
      <DataGrid
        columns={mockColumns}
        rows={mockRows}
        type="DataGrid"
        id="datagridId"
        ariaLabel="Test DataGrid"
        onChange={() => {}}
        paginationModel={paginationModel}
        pageSizeOptions={[10, 25, 50]}
      />,
    );
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByText("MockRow")).toBeInTheDocument();

    const grid = screen.getByTestId("data-grid-test-id");
    expect(grid).toHaveAttribute("aria-label", "Test DataGrid");
  });

  it("should handle row click", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <DataGrid
        columns={mockColumns}
        rows={mockRows}
        type="DataGrid"
        id="datagridId"
        onChange={onChange}
      />,
    );

    const row = screen.getByRole("row", { name: /1/ });
    fireEvent.click(row);

    expect(recordedEvents.length).toBe(1);
    expect(recordedEvents[0].componentType).toBe("DataGrid");
    expect(recordedEvents[0].id).toBe("datagridId");
    expect(recordedEvents[0].property).toBe("value");
    expect(recordedEvents[0].value).toEqual(mockRows[0]);
  });

  it("should render with other props correctly", () => {
    render(
      <DataGrid
        columns={mockColumns}
        rows={mockRows}
        type="DataGrid"
        id="datagridId"
        onChange={() => {}}
        ariaLabel="Test DataGrid"
        autoPageSize={true}
        checkboxSelection={true}
        density="compact"
        disableColumnFilter={true}
        loading={true}
      />,
    );

    const gridRole = screen.getByTestId("data-grid-test-id");

    // Check density
    expect(gridRole).toHaveClass("MuiDataGrid-root--densityCompact");

    // Check loading
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Check checkboxSelection
    expect(
      screen.getByRole("columnheader", { name: /select/i }),
    ).toBeInTheDocument();
  });

  it("should not render if no columns are provided", () => {
    render(
      <DataGrid
        rows={mockRows}
        type="DataGrid"
        id="datagridId"
        onChange={() => {}}
      />,
    );
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });
});
