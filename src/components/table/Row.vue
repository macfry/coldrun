<script lang="ts" setup>
import { inject, ref, watch, PropType } from 'vue';
import { Row, ITable } from '../../types/table';
import Cell from '../../components/table/Cell.vue';

const props = defineProps({
  rows: {
    type: Array as PropType<Row[]>,
    required: true,
  },
});

const myArray = ref(props.rows);
const emits = defineEmits(['toggleRow']);
const table = inject<ITable<{ id: number }>>('table');

watch(
  () => props.rows,
  (val) => (myArray.value = val),
);
</script>

<template>
          <div
            class="data-table-row"
            :class="[
              {
                'data-table-row--hidden': !table?.columns?.length,
              },
            ]"
            v-for="row in props.rows"
            :key="row.id"
          >
            <template v-if="table?.columns?.length">
              <div
                class="data-table-column"
                v-for="column in table.columns"
                :key="column.name"
              >
                <Cell
                  :row="row"
                  :column="column"
                />
              </div>
  
              <div class="data-table-column column-actions" v-if="$slots.actions">
                <slot name="actions" :row="row" />
              </div>
            </template>
          </div>
  
          

</template>

<style scoped lang="scss">
.data-table-row {
  &:nth-child(odd) {
    background-color: white;
  }

  &:nth-child(even) {
    background-color: darken(#f2f6fa, 2%);
  }
}
</style>
