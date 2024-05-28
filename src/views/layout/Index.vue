<script lang="ts" setup>
  import { ref } from 'vue';
  import { ITable } from '../../types/table';
  import Table from '../../components/table/Table.vue';
  
  const props = defineProps({
    table: {
      type: Object as () => ITable<{ id: number }>,
      required: true,
    },
    fetchData: {
      type: Function,
      required: false,
    },
    clickRow: {
      type: Function,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    tableFilters: {
      type: String,
    },
    refetch: {
      type: Boolean,
    },
    pagination: {
      type: Boolean,
      default: true,
    },
  });
  
  const filtersVisible = ref(true);
</script>

<template>
    <div v-if="$slots.filters || $slots.toolbar" class="row mb-5">
      <div class="col">
        <template v-if="$slots.filters">
          <button
            class="btn btn-secondary btn-icon"
            @click="filtersVisible = !filtersVisible"
          >
            {{ filtersVisible ? 'Hide filters' : 'Show filters' }}
          </button>
        </template>
      </div>
  
      <div class="col-auto">
        <slot name="toolbar" />
      </div>
    </div>
  
    <div class="row g-5">
      <template v-if="$slots.filters">
        <div
          v-if="filtersVisible"
          class="col-12 col-lg-auto"
          style="width: 300px"
        >
          <div class="row mb-4">
            <div class="col">
              <h4>Filters</h4>
            </div>
          </div>
          <slot name="filters" />
        </div>
      </template>
  
      <div class="col" style="min-width: 600px">
        <div class="card">
          <div class="card-body">
            <slot name="table">
              <Table
                :table="props.table"
                :fetch-data="props.fetchData"
                :click-row="props.clickRow"
                :loading="props.loading"
                :searchable="props.searchable"
                :filters="props.tableFilters"
                :refetch="props.refetch"
                :pagination="props.pagination"
              >
                <template #title>
                  <slot name="title" />
                </template>
  
                <template #actions="{ row }">
                  <slot :row="row" name="table-actions" />
                </template>
  
                <template #tablefilters>
                  <slot name="tablefilters" />
                </template>
              </Table>
            </slot>
          </div>
        </div>
      </div>
    </div>
</template>
