import { RowData, Table } from '@tanstack/react-table';
import { ReactTableContext } from '@client/provider/TableContext';
import React from 'react'

export const useReactTableCtx = () => {
    const context = React.useContext<Table<RowData> | undefined>(ReactTableContext);
    if (!context) {
        throw new Error("useReactTableContext must be used under ReactTableContext");
    }
    return context;
};
