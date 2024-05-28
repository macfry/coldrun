export enum ESort {
    ASC = 'asc',
    DESC = 'desc',
}

export interface IPagination {
    limit: number;
    sort: string;
    order: ESort
    page: number;
}

export interface CallbackOneParam<T1, T2 = void> {
    (param1?: T1): T2;
}
