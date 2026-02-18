/*
 * Copyright (c) 2019-2026 by Brockmann Consult Development team
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import {
  DataGrid as MuiDataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowModel,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import type { ComponentProps, ComponentState } from "@/index";

interface DataGridState extends ComponentState {
  rows?: GridRowModel[];
  columns?: GridColDef[];
  ariaLabel?: string;
  autoPageSize?: boolean;
  checkboxSelection?: boolean;
  density?: "compact" | "standard" | "comfortable";
  disableAutosize?: boolean;
  disableColumnFilter?: boolean;
  disableColumnMenu?: boolean;
  disableColumnResize?: boolean;
  disableColumnSelector?: boolean;
  disableColumnSorting?: boolean;
  disableDensitySelector?: boolean;
  disableMultipleRowSelection?: boolean;
  disableRowSelectionOnClick?: boolean;
  editMode?: "cell" | "row";
  hideFooter?: boolean;
  hideFooterPagination?: boolean;
  hideFooterSelectedRowCount?: boolean;
  initialState?: {
    pagination?: {
      paginationModel: GridPaginationModel;
    };
  };
  loading?: boolean;
  pageSizeOptions?: number[] | { label: string; value: number }[];
  paginationModel?: GridPaginationModel;
  rowHeight?: number;
  rowSelection?: boolean;
}

interface DataGridProps extends ComponentProps, DataGridState {}

export const DataGrid = ({
  type,
  id,
  style,
  rows,
  columns,
  ariaLabel,
  autoPageSize,
  checkboxSelection,
  density,
  disableAutosize,
  disableColumnFilter,
  disableColumnMenu,
  disableColumnResize,
  disableColumnSelector,
  disableColumnSorting,
  disableDensitySelector,
  disableMultipleRowSelection,
  disableRowSelectionOnClick,
  editMode,
  hideFooter,
  hideFooterPagination,
  hideFooterSelectedRowCount,
  initialState,
  loading,
  rowHeight,
  rowSelection,
  paginationModel,
  pageSizeOptions,
  onChange,
}: DataGridProps) => {
  if (!columns) {
    return;
  }

  const onRowsSelectionHandler = (ids: GridRowSelectionModel) => {
    if (id) {
      const selectedRowsData = ids.map((id) =>
        rows?.find((row) => row.id === id),
      );
      onChange({
        componentType: type,
        id: id,
        property: "value",
        value: selectedRowsData,
      });
    }
  };

  return (
    <div id={id}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        aria-label={ariaLabel}
        autoPageSize={autoPageSize}
        checkboxSelection={checkboxSelection}
        density={density}
        disableAutosize={disableAutosize}
        disableColumnFilter={disableColumnFilter}
        disableColumnMenu={disableColumnMenu}
        disableColumnResize={disableColumnResize}
        disableColumnSelector={disableColumnSelector}
        disableColumnSorting={disableColumnSorting}
        disableDensitySelector={disableDensitySelector}
        disableMultipleRowSelection={disableMultipleRowSelection}
        disableRowSelectionOnClick={disableRowSelectionOnClick}
        hideFooterSelectedRowCount={hideFooterSelectedRowCount}
        editMode={editMode}
        hideFooter={hideFooter}
        hideFooterPagination={hideFooterPagination}
        initialState={initialState}
        loading={loading}
        onRowSelectionModelChange={onRowsSelectionHandler}
        paginationModel={paginationModel}
        pageSizeOptions={pageSizeOptions}
        rowHeight={rowHeight}
        rowSelection={rowSelection}
        sx={style}
        data-testid="data-grid-test-id" // For testing purposes
      />
    </div>
  );
};
