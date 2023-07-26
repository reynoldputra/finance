import React from "react";
import { RowData, Table } from "@tanstack/react-table";

export const ReactTableContext = React.createContext<Table<RowData> | undefined>(undefined);

export interface ReactTableProviderProps<D> {
  children: React.ReactNode;
  table : Table<D>
} 

export const ReactTableProvider = <D extends RowData>({
  children,
  table 
}: ReactTableProviderProps<D>) => {
  return (
    // @ts-ignore
    <ReactTableContext.Provider value={table}>{children}</ReactTableContext.Provider>
  );
};
