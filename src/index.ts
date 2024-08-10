import { render } from '@cogears/app-view'
import '@cogears/app-view/dist/style.css'
import { ApiDocument } from "types"
import { RouterView } from 'vue-router'
import routes from './routes'
import store from './store'

export default function (doc: ApiDocument) {
    store.initialize(doc)
    render({ routes, view: RouterView })
}
