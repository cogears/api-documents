<script lang='ts' setup>
import { Column, DataTable, Input } from '@cogears/app-view';
import { ApiQuery } from 'types';

defineProps<{
    data: ApiQuery[],
}>()

const columns: Column[] = [
    { key: 'name', label: '名称', width: 100, widthFixed: true },
    { key: 'value', label: '值', width: 300, widthFixed: true },
    { key: 'remark', label: '说明', width: 300 },
]

</script>
<template>
    <div class="form">
        <DataTable :columns="columns" :data="data" full :selectable="false">
            <template #td-name="{ item }">
                <span class="select">{{ item.name }}</span>
            </template>
            <template #td-value="{ item }">
                <div class="input-wrapper">
                    <Input v-model:value="item.value" />
                </div>
            </template>
            <template #empty>没有参数</template>
        </DataTable>
    </div>
</template>
<style lang='scss' scoped>
.form {
    height: 100%;
    padding: 8px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    height: 100%;

    .input {
        flex: 1;
    }
}

.select {
    user-select: text;
}
</style>