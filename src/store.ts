import HttpClient, { HttpResponse } from '@cogears/http-client';
import { ApiDocument, ApiEnvironment, ApiItem, ApiQuery } from 'types';
import { reactive } from 'vue';

export interface ApiInstance extends ApiItem {
    result: HttpResponse
}

export interface ApiGroup {
    name: string,
    items: ApiInstance[]
}

export interface State {
    appName: string,
    environments: ApiEnvironment[],
    apiGroups: ApiGroup[],
    executing: boolean,
}

const http = new HttpClient()
const result: HttpResponse = { status: 0, headers: {}, body: '' }

class AppStore {
    state = reactive<State>({
        appName: '',
        environments: [],
        apiGroups: [],
        executing: false,
    })

    initialize(doc: ApiDocument) {
        this.state.appName = doc.appName || '接口文档'
        this.state.environments = doc.environments
        this.state.apiGroups = doc.apiGroups.map(group => {
            return {
                name: group.name,
                items: group.items.map(item => Object.assign({ result: Object.assign({}, result) }, item))
            }
        })
    }

    async execute(domain: string, api: ApiInstance) {
        if (this.state.executing) {
            return
        }
        try {
            this.state.executing = true
            let url = domain + format(api.path, api.params)
            let headers: any = toMap(api.headers)
            let query: any = toMap(api.query)
            api.result = await http.request(api.method, url, { headers, query, body: api.body })
        } finally {
            this.state.executing = false
        }
    }
}

function toMap(array: ApiQuery[]) {
    const map: any = {}
    for (let item of array) {
        map[item.name] = item.value
    }
    return map
}

function format(text: string, params: ApiQuery[]) {
    for (let item of params) {
        text = text.replace(new RegExp('\\${' + item.name + '}'), item.value)
    }
    return text
}

export default new AppStore()