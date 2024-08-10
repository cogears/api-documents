<script setup lang="ts">
import { Button, Combobox, IconNext, MenuOption, Option, Tree } from '@cogears/app-view';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import store, { ApiGroup, ApiInstance, State } from '../store';
import Sandbox from './Sandbox.vue';

const state = computed<State>(() => store.state)
const treeData = computed<MenuOption<string>[]>(() => store.state.apiGroups.map(group => ({ key: group.name, label: group.name, selected: true, children: group.items.map(item => ({ key: item.name, label: item.name })) })))
const environments = computed<Option<string>[]>(() => store.state.environments.map(item => ({ key: item.domain, label: item.name })))
const router = useRouter()
const route = useRoute()
const group = ref<ApiGroup>()
const api = ref<ApiInstance>()
const canExecute = computed(() => api.value && temp.environment)
const temp = reactive({
    treeValue: [] as string[],
    environment: '',
})
onMounted(refresh)
watch(route, refresh)

function refresh() {
    const groupName = route.params.group as string
    const name = route.params.name as string
    group.value = store.state.apiGroups.find(item => item.name == groupName)
    if (group.value) {
        api.value = group.value.items.find(item => item.name == name)
        if (api.value) {
            temp.treeValue = [groupName, name]
        } else {
            temp.treeValue = [groupName]
        }
    } else {
        api.value = undefined
        temp.treeValue = []
    }
}
function onTreeValueChanged() {
    router.push({
        name: 'home',
        params: {
            group: temp.treeValue[0],
            name: temp.treeValue[1]
        }
    })
}

function onExecute() {
    if (api.value && temp.environment) {
        store.execute(temp.environment, api.value)
    }
}
</script>
<template>
    <div class="works panel">
        <Sandbox :domain="temp.environment" :api="api" :loading="state.executing"></Sandbox>
        <div class="side frame border">
            <div class="logo">
                <b>{{ state.appName }}</b>
            </div>
            <div class="navigators panel">
                <Tree :options="treeData" v-model:value="temp.treeValue" @change="onTreeValueChanged"></Tree>
            </div>
        </div>
        <div class="top frame border">
            <span class="page-name">
                <template v-for="(name, i) in temp.treeValue">
                    <IconNext v-if="i > 0" />
                    {{ name }}
                </template>
            </span>
            <span class="space"></span>
            <Combobox class="item" :options="environments" v-model:value="temp.environment"></Combobox>
            <Button class="item" :disabled="!canExecute" @click="onExecute">执行接口</Button>
        </div>
    </div>
</template>
<style scoped lang="scss">
$side-width: 200px;
$top-height: 60px;

.works {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
    padding-left: $side-width;
    padding-top: $top-height;

    .side {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: $side-width;
        border-right-width: 1px;
        display: flex;
        flex-direction: column;
        padding: 0 8px 8px;

        .logo {
            display: flex;
            align-items: center;
            height: $top-height;

            b {
                font-size: 20px;
            }
        }

        .navigators {
            flex: 1;
        }
    }

    .top {
        position: fixed;
        left: $side-width;
        right: 0;
        top: 0;
        height: $top-height;
        border-bottom-width: 1px;
        display: flex;
        align-items: center;
        padding: 0 24px 0 12px;

        .page-name {
            display: flex;
            align-items: center;
            font-size: 18px;

            .icon {
                margin: 0 8px;
            }
        }

        .item {
            &+.item {
                margin-left: 24px;
            }
        }
    }
}
</style>