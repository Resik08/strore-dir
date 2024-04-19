import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia';
const pinia = createPinia();
import '@/assets/scss/normalize.scss';
import ClickOutsideDirective from '@/directives/click-outside-directive.js';
const app = createApp(App)
app.directive('click-outside', ClickOutsideDirective);
app.use(pinia);
app.mount('#app')