import { Component } from "vue";
import { ESort } from "./api";

export enum EType {
    COMPONENT = 'component',
    DATE = 'date',
}

export interface ISort {
    column: string;
    dir: ESort;
}

export type TValue = string | number | boolean;

interface RenderColumn<R> extends BaseColumn {
    render: (value: TValue, row: R, column: Column<R>) => string;
}
  
interface ComponentColumn extends BaseColumn {
    type: EType.COMPONENT;
    component: Component;
}

export interface BaseColumn {
    name: string;
    title: string;
    sortable?: boolean;
    width?: string;
    type?: EType;
}

export interface BaseRow {
    id: number | string;
    name?: string;
}

export type Row = BaseRow;

export type Column<R = Row> = BaseColumn | ComponentColumn | RenderColumn<R>;

export interface ITable<R extends Row> {
    columns: Column<R>[];
    rows: R[];
    actions?: {
        width: string;
    };
    sort?: ISort;
}
