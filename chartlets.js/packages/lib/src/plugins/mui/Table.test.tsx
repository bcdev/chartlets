import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Table } from "@/plugins/mui/Table";
import { createChangeHandler } from "@/plugins/mui/common.test";

describe("Table", () => {
  const rows = [
    { id: 1, data: { firstName: "John", lastName: "Doe" } },
    { id: 2, data: { firstName: "Johnie", lastName: "Undoe" } },
  ];
  const columns = [
    { id: "firstName", label: "First Name" },
    { id: "lastName", label: "Last Name" },
  ];

  it("should render the Table component", () => {
    render(
      <Table
        id="table"
        type={"Table"}
        rows={rows}
        columns={columns}
        onChange={() => {}}
      />,
    );

    const table = screen.getByRole("table");
    expect(table).toBeDefined();
    columns.forEach((column) => {
      expect(screen.getByText(column.label)).toBeInTheDocument();
    });
    rows.forEach((row) => {
      expect(screen.getByText(row.data.firstName)).toBeInTheDocument();
      expect(screen.getByText(row.data.lastName)).toBeInTheDocument();
    });
  });

  it("should not render the Table component when no columns provided", () => {
    render(<Table id="table" type={"Table"} rows={rows} onChange={() => {}} />);

    const table = screen.queryByRole("table");
    expect(table).toBeNull();
  });

  it("should not render the Table component when no rows provided", () => {
    render(<Table id="table" type={"Table"} rows={rows} onChange={() => {}} />);

    const table = screen.queryByRole("table");
    expect(table).toBeNull();
  });

  it("should call onChange on row click", () => {
    const { recordedEvents, onChange } = createChangeHandler();
    render(
      <Table
        id="table"
        type={"Table"}
        rows={rows}
        columns={columns}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getAllByRole("row")[1]);
    expect(recordedEvents.length).toEqual(1);
    expect(recordedEvents[0]).toEqual({
      componentType: "Table",
      id: "table",
      property: "value",
      value: {
        id: 1,
        data: {
          firstName: "John",
          lastName: "Doe",
        },
      },
    });
  });
});
