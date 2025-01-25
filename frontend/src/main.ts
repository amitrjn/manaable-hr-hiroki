import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { supabase } from './lib/supabase'

const app = createApp(App)

// Make Supabase available throughout the app
app.config.globalProperties.$supabase = supabase

app.use(createPinia())
app.use(router)

app.mount('#app')
