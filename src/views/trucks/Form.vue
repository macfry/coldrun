<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ETruckStatus, ITruck, truckStatusOptions } from '../../types/truck';

import LayoutForm from '../layout/Form.vue';
import InputText from '../../components/forms/InputText.vue';
import InputSelect from '../../components/forms/InputSelect.vue';

interface IRequiredFields {
    code: boolean
    name: boolean;
    status: boolean
}

const route = useRoute();
const router = useRouter();
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const controller = new AbortController();

const requiredFieldsValid = reactive<IRequiredFields>({
    code: false,
    name: false,
    status: false,
});

const ifFormValid = computed<boolean>(
    () =>
        requiredFieldsValid.code &&
        requiredFieldsValid.name &&
        requiredFieldsValid.status,
);

const validate = (valid: boolean, field: keyof IRequiredFields) => {
    requiredFieldsValid[field] = valid;
};

const initialState = {
    code: '',
    name: '',
    status: ETruckStatus.OUT_OF_SERVICE,
    description: '',
};

const state = reactive<Omit<ITruck, 'id'>>({ ...initialState });
const resetState = () => Object.assign(state, initialState);

const statusOptions = computed(() => {
    switch(ETruckStatus[state.status]) {
        case ETruckStatus.LOADING:
            return (({ OUT_OF_SERVICE, TO_JOB }) => ({ OUT_OF_SERVICE, TO_JOB }))(truckStatusOptions);
        case ETruckStatus.TO_JOB:
            return (({ OUT_OF_SERVICE, AT_JOB }) => ({ OUT_OF_SERVICE, AT_JOB }))(truckStatusOptions);
        case ETruckStatus.AT_JOB:
            return (({ OUT_OF_SERVICE, RETURNING }) => ({ OUT_OF_SERVICE, RETURNING }))(truckStatusOptions);    
        case ETruckStatus.RETURNING:
            return (({ OUT_OF_SERVICE, LOADING }) => ({ OUT_OF_SERVICE, LOADING }))(truckStatusOptions);
        default:
            return truckStatusOptions;
    }
});

const makeRequest = async (url: string, method: 'PUT' | 'POST', body: Omit<ITruck, 'id'>) => {
    try {
        loading.value = true;
        error.value = null;
        const requestOptions = {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        };
        const response = await fetch(`${url}`, requestOptions);
        const data: ITruck = await response.json();

        if (response.ok && data) {
            router.push({ name: 'trucks/index' });
        }
    } catch (err: unknown) {
        const errMsg = err as Error;
        error.value = errMsg.message;
    } finally {
        loading.value = false;
    }
};

const submit = async () => {
    if (route.params.id) {
        await makeRequest(`http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks/${route.params.id}`, 'PUT', state);
    } else {
        await makeRequest('http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks', 'POST', state);
    }
};

const getTruck = async (id: number) => {
    try {
        loading.value = true;
        error.value = null;

        const response = await fetch(
            `http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com/trucks/${id}`, 
            { signal: controller.signal },
        );
        const data: ITruck = await response.json();

        if (data) {
            state.code = data.code;
            state.name = data.name;
            state.status = data.status;
            state.description = data.description ?? '';
        }
    } catch (err: unknown) {
        const errMsg = err as Error;
        error.value = errMsg.message;
    } finally {
        loading.value = false;
    }
}

onMounted(async () => {
    if (!route.params.id) return;
    await getTruck(Number(route.params.id as string));
});

onBeforeUnmount(() => {
  resetState();
  controller.abort();
});
</script>

<template>
    <LayoutForm
        :editable="!!route.params.id"
        :loading="loading"
        :submit="submit"
        :submit-disabled="!ifFormValid"
    >
        <template #submitButton>Save Truck</template>

        <div class="col-12">
            <div class="card mb-4">
                <div class="card-body">
                    <input-text
                        class="mb-3"
                        label="Truck Code"
                        name="truckCode"
                        placeholder="Truck Code"
                        v-model="state.code"
                        :required="true"
                        :validationMessage="error"
                        @is-valid="(e) => validate(e, 'code')"
                    />

                    <input-text
                        class="mb-3"
                        label="Truck Name"
                        name="truckName"
                        placeholder="Truck Name"
                        v-model="state.name"
                        :required="true"
                        :validationMessage="error"
                        @is-valid="(e) => validate(e, 'name')"
                    />

                    <input-select
                        class="mb-3"
                        label="Truck Status"
                        name="truckStatus"
                        :options="statusOptions"
                        v-model="state.status"
                        :required="true"
                        :validationMessage="error"
                        @is-valid="(e) => validate(e, 'status')"
                    ></input-select>

                    <input-text
                        class="mb-0"
                        label="Truck Description"
                        name="truckDescription"
                        placeholder="Truck Description"
                        v-model="state.description"
                        :required="false"
                    />
                </div>
            </div>
        </div>
    </LayoutForm>
</template>