export interface ApiDocument {
    appName: string,
    environments: ApiEnvironment[],
    apiGroups: Array<{
        name: string,
        items: ApiItem[]
    }>
}

export interface ApiEnvironment {
    name: string,
    domain: string,
}

export interface ApiItem {
    name: string,
    remark: string,
    method: Method,
    path: string,
    headers: ApiQuery[],
    params: ApiQuery[],
    query: ApiQuery[],
    body: any,
    response: string,
}

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface ApiQuery {
    name: string,
    value: string,
    remark: string,
}

export default function (doc: ApiDocument): void