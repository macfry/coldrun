<script lang="ts" setup>
import { computed } from 'vue';

const emits = defineEmits(['update:modelValue']);

const props = defineProps({
  pageCount: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 25,
  },
  page: {
    type: Number,
    required: true,
    default: 1,
  },
  totalItems: {
    type: Number,
  },
  visiblePages: {
    type: Number,
    default: 6,
  },
});

const pagesArr = computed<number[]>(() => {
  const pages = [...Array(props.pageCount).keys()].map((i) => i + 1);
  if (props.pageCount > props.visiblePages) {
    const itemsPerSite = Math.ceil(props.visiblePages / 2);
    const startArr = pages.slice(0, itemsPerSite);
    const stopArr = pages.slice(-1 * itemsPerSite);
    return [...startArr, 0, ...stopArr];
  } else {
    return pages;
  }
});
</script>

<template>
    <nav
      aria-label="Pagination"
      class="d-flex justify-content-end mt-3"
      v-if="pageCount > 0"
    >
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: props.page === 1 }">
          <a
            aria-label="Previous"
            class="page-link"
            href="#"
            @click="emits('update:modelValue', props.page - 1)"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
  
        <li
          v-for="n in pagesArr"
          :key="n"
          :class="{ active: n === props.page, disabled: n === 0 }"
          :aria-current="n === props.page ? 'page' : ''"
          class="page-item"
        >
          <a v-if="n === 0" class="page-link" href="#"
            ><span aria-hidden="true">&hellip;</span>
          </a>
          <a
            v-else
            class="page-link"
            href="#"
            @click="emits('update:modelValue', n)"
            >{{ n }}</a
          >
        </li>
  
        <li class="page-item" :class="{ disabled: props.page === pageCount }">
          <a
            aria-label="Next"
            class="page-link"
            href="#"
            @click="emits('update:modelValue', props.page + 1)"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
</template>
