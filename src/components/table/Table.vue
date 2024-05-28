<script lang="ts" setup>
import {
  computed,
  provide,
  useSlots,
  ref,
  watch,
  onMounted,
  watchEffect,
} from 'vue';
import { ITable } from '../../types/table';
import Pagination from './Pagination.vue';
import Loader from '../Loader.vue';
import Row from './Row.vue';
import { ESort } from '../../types/api';

const props = defineProps({
  title: {
    type: String,
  },
  table: {
    type: Object as () => ITable<{ id: number }>,
    required: true,
  },
  pagination: {
    type: Boolean,
    default: true,
  },
  pageSize: {
    type: Number,
    default: 25,
  },
  fetchData: {
    type: Function,
  },
  clickRow: {
    type: Function,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  filters: {
    type: String,
    default: '',
  },
  refetch: {
    type: Boolean,
    default: false,
  },
});

provide('table', props.table);

const emits = defineEmits(['update:modelValue']);

const slots = useSlots();
const sorting = ref(props.table.sort ?? null);
const pageValue = ref<number>(1);
const pageCount = ref<number>(0);
const pageSize = ref<number>(props.pageSize);
const tableRows = ref<{ id: number }[]>([]);

const widths = computed(() => `${props.table.columns
    .map((column) => column.width || 'minmax(200px, 1fr)')
    .join(' ')} ${slots.actions ? props.table.actions?.width || '120px' : ''}`
);

const emptyTable = computed(() => {
  return tableRows.value.length === 0;
});

const sort = (column: string) => {
  if (sorting.value && sorting.value?.column === column) {
    sorting.value =
      sorting.value.dir == ESort.ASC ? { column, dir: ESort.DESC } : null;
  } else {
    sorting.value = {
      column,
      dir: ESort.ASC,
    };
  }
};

const sortItems = (arr: { id: number }[]) => {
  if (Array.isArray(arr) && arr.length) {
    return arr.sort((a, b) => {
      let fa = a[sorting?.value?.column];
      let fb = b[sorting?.value?.column];
      fa = fa ? fa.toLowerCase() : null;
      fb = fb ? fb.toLowerCase() : null;

      if (fa === null || fb === null) {
        return 0;
      } else {
        if (fa < fb) {
          return -1;
        }
        if (fa > fb) {
          return 1;
        }
        return 0;
      }
    });
  } else {
    return [];
  }
};

// sorted data
const sortRows = (rows: { id: number }[]) => {
  let tempData = rows;
  // sort
  if (sorting.value) {
    tempData = sortItems(tempData);

    if (sorting.value.dir === ESort.DESC) {
      tempData.reverse();
    }
  }
  return tempData;
};

// pagination
const setPaginationData = (res: any): void => {
  if (!props.pagination) return;

  if (res?.page && res?.page_count && res?.page_size) {
    pageValue.value = res.page;
    pageCount.value = res.page_count;
    pageSize.value = res.page_size;
  }
};

onMounted(async () => {
  if (props.fetchData) {
    await props.fetchData('', setPaginationData);
  }
});

watchEffect(() => {
  if (props.table) {
    tableRows.value = sortRows(props.table.rows);
  }
});

watch(
  [pageValue, () => props.filters, () => props.refetch],
  async (
    [newPage, newFilters, newRefetch],
    [prevPage, prevFilters, _prevRefetch],
  ) => {
    if (
      ((props.pagination && newPage !== prevPage) ||
        newFilters !== prevFilters ||
        newRefetch) &&
      typeof props.fetchData === 'function'
    ) {
      const param = `page=${newPage}${newFilters ? `&${newFilters}` : ''}`;
      await props.fetchData(param.trim(), setPaginationData);
    }
  },
);
</script>

<template>
    <div class="d-flex align-items-center flex-wrap mb-4 gap-3">
      <h3 class="mb-0 me-4 flex-grow-1">
        <slot name="title">
          {{ title }}
        </slot>
      </h3>
  
      <slot name="toolbar" />
    </div>
  
    <div class="">
      <slot name="tablefilters" />
    </div>
   
    <div class="table-responsive">
      <div class="data-table">
        <div class="data-table-header">
          <div class="data-table-row">
            <div
              class="data-table-column column-title"
              v-for="column in table.columns"
              :key="column.name"
              @click="column.sortable && sort(column.name)"
            >
              <span>
                {{ column.title }}
              </span>
            </div>
  
            <div class="data-table-column column-actions" v-if="$slots.actions">
              Actions
            </div>
          </div>
        </div>
  
        <div class="data-table-body">
          <div class="text-center p-3" v-if="props.loading">
            <Loader class="spinner"></Loader>
          </div>

          <template v-else-if="!props.loading">
            <div class="text-center p-3" v-if="emptyTable">
              No items to display
            </div>
  
            <Row
              v-else
              :rows="tableRows"
            >
              <template #actions="{ row }" v-if="$slots.actions">
                <slot name="actions" :row="row" />
              </template>
            </Row>
          </template>
        </div>
      </div>
    </div>
  
    <Pagination
      v-if="!emptyTable && props.pagination"
      :page-count="pageCount"
      :page-size="pageSize"
      :page="pageValue"
      v-model="pageValue"
    ></Pagination>
  </template>
  

<style scoped lang="scss">
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import './../../scss/variables';

.data-table {
  --#{$variable-prefix}table-bg: #{$table-bg};
  --#{$variable-prefix}table-accent-bg: #{$table-accent-bg};
  --#{$variable-prefix}table-active-color: #{$table-active-color};
  --#{$variable-prefix}table-active-bg: #{$table-active-bg};
  --#{$variable-prefix}table-hover-color: #{$table-hover-color};
  --#{$variable-prefix}table-hover-bg: #{$table-hover-bg};

  width: 100%;
  margin-bottom: $spacer;
  color: $table-color;
  vertical-align: $table-cell-vertical-align;
  border-color: $table-border-color;

  > :not(:first-child) {
    border-top: 2 solid $table-group-separator-color;
  }

  &-header {
    color: $table-head-color;

    :deep(.data-table-column) {
      background: $table-head-bg;
      flex-wrap: nowrap;
      display: flex;
      align-items: center;

      &.column-title {
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  :deep(.data-table-column) {
    position: relative;
    padding: $table-cell-padding-y $table-cell-padding-x;
  }

  &-body {
    :deep(.data-table-column) {
      border-bottom: 1 solid $table-border-color;

      &.column-actions {
        > div {
          display: flex;
          justify-content: flex-end;
          flex-wrap: nowrap;
        }

        padding-right: $table-cell-padding-x - 0.3rem;
        padding-top: $table-cell-padding-y - 0.2rem;
        padding-bottom: $table-cell-padding-y - 0.2rem;

        .btn {
          padding: 0.1rem 0.3rem;
          font-size: 1rem;
          color: $gray-500;
          box-shadow: none;

          &:hover {
            color: $gray-700;
          }
        }
      }
    }
  }

  :deep(.data-table-row) {
    display: grid;
    grid-template-columns: v-bind(widths);

    .data-table-column {
      &:first-child {
        display: flex;
        flex-wrap: nowrap;
        padding: 0.85rem 0.65rem;
      }

      &.column-actions {
        justify-content: flex-end;
      }
    }
  }
}

.spinner {
  width: 40px;
  height: 40px;
  font-size: 16px;
}
</style>