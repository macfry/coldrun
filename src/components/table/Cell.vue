<script lang="ts" setup>
defineProps({
  row: {
    type: Object,
    required: true,
  },
  column: {
    type: Object,
    required: true,
  },
});
</script>

<template>
    <template v-if="row[column.name] !== undefined">
      <div
        v-if="column.render"
        v-html="column.render(row[column.name], row, column)"
        class="render-col"
      ></div>
  
      <template v-else-if="column.type === 'component'">
        <component :is="column.component" :column="column" :row="row" />
      </template>
  
      <template v-else-if="column.type === 'date'">
        {{ row[column.name]?.toLocaleDateString() }}
        {{ row[column.name]?.getHours() }}:{{ row[column.name]?.getMinutes() }}
      </template>
  
      <template v-else>
        {{ row[column.name] }}
      </template>
    </template>
  </template>

<style lang="scss">
.render-col {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}
</style>