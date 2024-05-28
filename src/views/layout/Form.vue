<script lang="ts" setup>  
  const props = defineProps({
    editable: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    submit: {
      type: Function,
      required: true,
    },
    submitDisabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  });
</script>

<template>
    <div class="row g-4">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
    </div>
  
    <div class="d-flex justify-content-end align-items-center mt-3">
      <button
        class="btn btn-primary"
        @click="props.submit"
        :disabled="props.submitDisabled || props.loading"
      >
        <slot name="submitButton" v-if="$slots.submitButton"></slot>
        <template v-else>Save changes</template>
        <loader v-if="props.loading"></loader>
      </button>
    </div>
</template>
  