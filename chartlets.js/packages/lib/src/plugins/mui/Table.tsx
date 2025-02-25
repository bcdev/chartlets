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
import type { SxProps } from "@mui/system";

interface TableCellProps {
  id: string | number;
  size?: "medium" | "small";
  align?: "inherit" | "left" | "center" | "right" | "justify";
  padding?: "checkbox" | "none" | "normal";
  sx?: SxProps;
}

interface TableColumn extends TableCellProps {
  label: string;
}

interface TableState extends ComponentState {
  rows?: (string | number | boolean | undefined)[][];
  columns?: TableColumn[];
  hover?: boolean;
  stickyHeader?: boolean;
}

interface TableProps extends ComponentProps, TableState {}

export const Table = ({
  type,
  id,
  style,
  rows,
  columns,
  hover,
  stickyHeader,
  onChange,
}: TableProps) => {
  if (!columns || columns.length === 0) {
    return <div>No columns provided.</div>;
  }

  if (!rows || rows.length === 0) {
    return <div>No rows provided.</div>;
  }

  const handleRowClick = (row: (string | number | boolean | undefined)[]) => {
    const rowData = row.reduce(
      (acc, cell, cellIndex) => {
        const columnId = columns[cellIndex]?.id;
        if (columnId) {
          acc[columnId] = cell;
        }
        return acc;
      },
      {} as Record<string, string | number | boolean | undefined>,
    );
    if (id) {
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: rowData,
      });
    }
  };

  // function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  //   if (b[orderBy] < a[orderBy]) {
  //     return -1;
  //   }
  //   if (b[orderBy] > a[orderBy]) {
  //     return 1;
  //   }
  //   return 0;
  // }
  //
  // type Order = "asc" | "desc";
  //
  // function getComparator<Key extends keyof any>(
  //   order: Order,
  //   orderBy: Key,
  // ): (
  //   a: { [key in Key]: number | string },
  //   b: { [key in Key]: number | string },
  // ) => number {
  //   return order === "desc"
  //     ? (a, b) => descendingComparator(a, b, orderBy)
  //     : (a, b) => -descendingComparator(a, b, orderBy);
  // }

  return (
    <TableContainer component={Paper} sx={style} id={id}>
      <MuiTable stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "inherit"}
                size={column.size || "medium"}
                padding={column.padding}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, row_index) => (
            <TableRow
              hover={hover}
              key={row_index}
              onClick={() => handleRowClick(row)}
            >
              {row?.map((item, item_index) => (
                <TableCell
                  key={item_index}
                  align={columns[item_index].align || "inherit"}
                  size={columns[item_index].size || "medium"}
                  padding={columns[item_index].padding}
                >
                  {item}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};
