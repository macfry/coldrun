<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useTable } from '../../composables/table';
import { truckTable } from '../../utils/tables';
import { CallbackOneParam } from '../../types/api';
import { ITruck } from '../../types/truck';
import LayoutIndex from '../layout/Index.vue';
import Loader from '../../components/Loader.vue';

const table = useTable(truckTable);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const controller = new AbortController();

const fetchData = async (
  params = '',
  callback?: CallbackOneParam<unknown>,
): Promise<void> => {
  const parameters = params ? `&${params}` : '';

  try {
    loading.value = true;
    error.value = null;

    const response = await fetch(
      `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks${parameters ? `?${parameters}` : ''}`, 
      // { signal: controller.signal },
    );
    const data: ITruck[] = await response.json();

    if (data) {
      table.rows = (data ?? []).map(({ status, ...rest }) => ({ ...rest, status: status.replace('_', ' ') }));
    }

    if (callback) {
      callback(data);
    }
  } catch (err: unknown) {
    const errMsg = err as Error;
    error.value = errMsg.message;
  } finally {
    loading.value = false;
  }
};

onBeforeMount(() => {
  table.rows = [];
  controller.abort();
});
</script>

<template>
  <layout-index :table="table" :fetch-data="fetchData" :loading="loading">
    <template #title>
      Trucks
      <Loader v-if="loading" />
    </template>

    <template #toolbar>
      <router-link
        :to="{ name: 'trucks/create' }"
        class="btn btn-warning btn-icon"
      >
        New truck
      </router-link>
    </template>

    <template #table-actions="{ row }">
      <router-link
        :to="{
          name: 'trucks/edit',
          params: { id: row.id },
          query: { name: row.name ?? '' },
        }"
        class="btn"
      >
        Edit
      </router-link>
    </template>
  </layout-index>
</template>
