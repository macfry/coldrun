export enum ETruckStatus {
    OUT_OF_SERVICE = 'Out of service', 
    LOADING = 'Loading', 
    TO_JOB = 'To job', 
    AT_JOB = 'At job', 
    RETURNING = 'Returning',
}

export interface ITruck {
    id: number;
    code: string;
    name: string;
    status: ETruckStatus;
    description?: string;
}

export interface ITableTruck extends Omit<ITruck, 'status'> {
    status: string;
}

const generateAraayOfOptions = (key: keyof typeof ETruckStatus): [keyof typeof ETruckStatus, string] => ([
    key,
    ETruckStatus[key],
]);

const mapArrayOfOptions = (
    Object.keys(ETruckStatus) as (keyof typeof ETruckStatus)[]
).map(generateAraayOfOptions);

export const truckStatusOptions = Object.fromEntries(mapArrayOfOptions);
