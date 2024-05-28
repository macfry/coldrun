<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
  import { computed, PropType, reactive, watch } from 'vue';
  import Multiselect from '@vueform/multiselect';
  
  const props = defineProps({
    label: {
      type: String,
    },
    labelProp: {
      type: String,
      default: 'label',
    },
    name: {
      type: String,
      required: true,
    },

    options: {
      type: [Array, Function],
    },
    validationMessage: {
      type: String,
      required: false,
    },
    modelValue: {
      type: [String, Array as PropType<unknown[]>],
    },
    required: {
      type: Boolean,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      reqired: false,
      default: false,
    },
  });
  const emits = defineEmits(['update:modelValue', 'isValid']);
  
  const localValue = computed({
    get() {
      return props.modelValue;
    },
    set(val) {
      emits('update:modelValue', val);
    },
  });
  
  const validation = reactive({
    isValid: false,
    message: '',
  });
  
  const errorMessage = computed(() => {
    return Array.isArray(props.validationMessage)
      ? props.validationMessage[0]
      : props.validationMessage || validation.message;
  });
  
  const validate = (value: unknown[] | undefined, showMessage = true) => {
    if (props.required) {
      if (
        (Array.isArray(value) && value?.length) ||
        (!Array.isArray(value) && (value || value === 0))
      ) {
        validation.isValid = true;
        if (showMessage) {
          validation.message = '';
        }
      } else {
        validation.isValid = false;
        if (showMessage) {
          validation.message = 'This field is required.';
        }
      }
  
      emits('isValid', validation.isValid);
    }
  };
  
  watch(
    localValue,
    (_newValue, oldValue) => {
      validate(localValue.value, oldValue === undefined ? false : true);
    },
    { immediate: true },
  );
  </script>


<template>
    <div>
      <label
        class="form-label"
        :class="{ 'form-label--required': props.required }"
        :for="name"
        v-if="label"
      >
        {{ label }}
        <template v-if="required"> *</template>
        <slot></slot>
      </label>

      <Multiselect
        :id="name"
        v-bind="$attrs"
        :label="labelProp"
        v-model="localValue"
        :options="options"
        class="multiselect"
        :class="{ 'is-invalid': !!errorMessage }"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event)"
        :loading="loading"
        :canClear="false"
      />

      <div class="invalid-feedback mb-3">
        {{ errorMessage }}
      </div>
    </div>
</template>

  <style src="@vueform/multiselect/themes/default.css"></style>
  
  <style lang="scss" scoped>
  .multiselect {
    --ms-tag-font-weight: 400;
    --ms-tag-remove-radius: 50%;
    --ms-tag-py: 0.4rem;
    --ms-tag-px: 0.8rem;
    --ms-tag-remove-mx: 0.4rem;
    --ms-font-size: 1em;
    --ms-line-height: 1.5;
    --ms-option-font-size: 1em;
    --ms-ring-color: none;
  
    --ms-py: 0.6rem;
    --ms-px: 1rem;
  
    --ms-option-font-size: 1em;
    --ms-option-line-height: 1.5;
  }

  :deep(.multiselect-option) {
    &:first-child {
      margin-top: 0.5em;
    }
    &:last-child {
      margin-bottom: 0.5em;
    }
  }
  </style>