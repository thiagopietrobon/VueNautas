import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { inicializarTema } from './composables/useTema'

inicializarTema()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')