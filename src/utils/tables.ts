import { ITable } from "../types/table";
import { ITableTruck } from "../types/truck";

export const truckTable: ITable<ITableTruck> = {
    columns: [
      {
        name: 'name',
        title: 'Name',
        sortable: true,
        width: 'minmax(200px, 1fr)',
      },
      {
        name: 'code',
        title: 'Code',
        sortable: true,
        width: 'minmax(200px, 20%)',
      },
      {
        name: 'status',
        title: 'Status',
        sortable: true,
        width: 'minmax(200px, 20%)',
      },
      {
        name: 'description',
        title: 'Description',
        width: 'minmax(200px, 30%)',
      },
    ],
    rows: [],
  };