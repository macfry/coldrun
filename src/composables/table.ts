import { Row, ITable } from '../types/table';
import { reactive, UnwrapNestedRefs } from 'vue';

export function useTable<T extends { id: string | number } = Row>(
  table: ITable<T>,
): UnwrapNestedRefs<ITable<T>> {
  return reactive(table);
};
