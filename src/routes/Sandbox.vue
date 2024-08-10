<script lang='ts' setup>
import { Loading, TabPages } from '@cogears/app-view';
import { reactive } from 'vue';
import { ApiInstance } from '../store';
import Body from './Body.vue';
import QueryInput from './QueryInput.vue';

defineProps<{
    domain: string,
    api?: ApiInstance,
    loading: boolean,
}>()
const requestTabs = reactive({
    options: [
        { key: 'headers', label: 'headers' },
        { key: 'path', label: 'path' },
        { key: 'query', label: 'query' },
        { key: 'body', label: 'body' },
    ],
    value: 'headers',
})

const responseTabs = reactive({
    options: [
        { key: 'remark', label: '返回值说明' },
        { key: 'headers', label: 'headers' },
        { key: 'body', label: 'body' },
    ],
    value: 'remark',
})

function parseJSON(text: string): string {
    try {
        return JSON.stringify(JSON.parse(text), undefined, 4)
    } catch (e) {
        return text
    }
}
</script>
<template>
    <div class="target frame border">
        <label class="text2">{{ api?.remark }}</label>
    </div>
    <div class="sandbox">
        <div>
            <div class="target frame border">
                <label>接口：</label>
                <span class="method select">{{ api?.method }}</span>
                <span class="select">{{ domain }}{{ api?.path }}</span>
            </div>
            <TabPages :options="requestTabs.options" v-model:value="requestTabs.value" :border="false" full>
                <template #headers>
                    <QueryInput v-if="api" :data="api.headers"></QueryInput>
                </template>
                <template #path>
                    <QueryInput v-if="api" :data="api.params"></QueryInput>
                </template>
                <template #query>
                    <QueryInput v-if="api" :data="api.query"></QueryInput>
                </template>
                <template #body>

                    <Body v-if="api" :api="api"></Body>
                </template>
            </TabPages>
        </div>
        <div class="border">
            <div class="target frame border">
                <label>执行结果：</label>
                {{ api?.result.status }}
            </div>
            <div class="result">
                <TabPages :options="responseTabs.options" v-model:value="responseTabs.value" :border="false" full>
                    <template #remark>
                        <div class="json select" v-html="api?.response"></div>
                    </template>
                    <template #headers>
                        <div class="json select">{{ api?.result.headers }}</div>
                    </template>
                    <template #body>
                        <div class="json select">{{ parseJSON(api?.result.body) }}</div>
                    </template>
                </TabPages>
                <Loading :visible="loading"></Loading>
            </div>
        </div>
    </div>
</template>
<style lang='scss' scoped>
.border {
    border-bottom-width: 1px;
}

.target {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 12px;

    .method {
        width: 60px;
    }
}

.sandbox {
    display: flex;
    flex: 1;
    overflow: hidden;

    >div {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.border {
            border-left-width: 1px;
        }
    }
}

.result {
    position: relative;
    flex: 1;
    overflow: auto;
}

.json {
    white-space: pre;
    padding: 8px;
}

.select {
    user-select: text;
}
</style>