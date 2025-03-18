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
import { Skeleton } from "@/plugins/mui/Skeleton";
import type { ReactElement } from "react";
import { useLoadingState } from "@/hooks";

interface TableCellProps {
  id: string | number;
  size?: "medium" | "small";
  align?: "inherit" | "left" | "center" | "right" | "justify";
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
  skeletonProps,
  onChange,
}: TableProps) => {
  const loadingState = useLoadingState();
  if (!id) {
    return;
  }
  const isLoading = loadingState[id];
  if (isLoading == "failed") {
    return <div>An error occurred while loading the data.</div>;
  }

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

  const table: ReactElement | null = (
    <TableContainer component={Paper} sx={style} id={id}>
      <MuiTable stickyHeader={stickyHeader}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || "inherit"}
                size={column.size || "medium"}
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

  const isSkeletonRequired = skeletonProps !== undefined;
  if (!isSkeletonRequired) {
    return table;
  }
  const skeletonId = id + "-skeleton";
  return (
    <Skeleton
      isLoading={isLoading}
      id={skeletonId}
      style={style}
      {...skeletonProps}
    >
      {table}
    </Skeleton>
  );
};
