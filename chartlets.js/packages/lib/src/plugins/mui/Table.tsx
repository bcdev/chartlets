import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { ComponentProps, ComponentState } from "@/index";

interface TableCellProps {
  id: string | number;
  size?: "medium" | "small" | string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
}

interface TableColumn extends TableCellProps {
  label: string;
}

type row = {
  [key: string]: string | number | boolean | undefined;
};

interface TableRowData extends TableCellProps {
  data: row;
}

interface TableState extends ComponentState {
  rows?: TableRowData[];
  columns?: TableColumn[];
  hover?: boolean;
}

interface TableProps extends ComponentProps, TableState {}

export const Table = ({
  type,
  id,
  style,
  rows,
  columns,
  hover,
  onChange,
}: TableProps) => {
  if (!columns || columns.length === 0) {
    return <div>No columns provided.</div>;
  }

  if (!rows || rows.length === 0) {
    return <div>No rows provided.</div>;
  }

  const handleRowClick = (row: TableRowData) => {
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: row,
      });
    }
  };

  return (
    <TableContainer component={Paper} style={style} id={id}>
      <MuiTable>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} align={column.align || "left"}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              hover={hover}
              key={row.id}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column) => (
                <TableCell
                  key={`${row.id}-${column.id}`}
                  align={column.align || "left"}
                >
                  {row.data[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
