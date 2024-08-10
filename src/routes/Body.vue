<script lang='ts' setup>
import { Input } from '@cogears/app-view';
import { computed } from 'vue';
import { ApiInstance } from '../store';

const props = defineProps<{
    api: ApiInstance
}>()

const text = computed({
    get() {
        return JSON.stringify(props.api.body)
    },
    set(value) {
        try {
            props.api.body = JSON.parse(value)
        } catch (e) { }
    }
})

</script>
<template>
    <div class="form">
        <Input textarea v-model:value="text" />
    </div>
</template>
<style lang='scss' scoped>
.form {
    height: 100%;
    padding: 8px;

    .input {
        &.textarea {
            width: 100%;
            height: 100%;
        }
    }
}
</style>