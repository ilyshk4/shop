/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import GoodsView from './GoodsView.vue'
import BrandsView from './BrandsView.vue'
import CategoriesView from './CategoriesView.vue'
import UsersView from './UsersView.vue'

// Composables
import { createApp } from 'vue'
import { store } from './store'
import axios from 'axios';
import { restoreToken } from './auth';
import { createMemoryHistory, createRouter } from 'vue-router'

axios.defaults.baseURL = 'http://localhost:8000/';

const app = createApp(App)
app.use(store)

registerPlugins(app)

restoreToken();

const routes = [
    { path: '/', name: "Товары", component: GoodsView },
    { path: '/categories', name: "Категории", component: CategoriesView },
    { path: '/brands', name: "Бренды", component: BrandsView },
    { path: '/users', name: "Пользователи", component: UsersView },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

app.use(router)

app.mount('#app')
