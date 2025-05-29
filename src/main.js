import { createApp } from 'vue';
import './style.css';
import './assets/fonts/font.css'
import App from './App.vue';
import router from './router';
import request from '@/utils/request';
import { createPinia } from 'pinia';
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VueMarkdownPreview from  '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// import createMermaidPlugin from '@kangc/v-md-editor/lib/plugins/mermaid/cdn';
// import '@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css';
import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
})
VueMarkdownEditor.use(createEmojiPlugin());
VueMarkdownEditor.use(createLineNumbertPlugin());
VueMarkdownEditor.use(createCopyCodePlugin());
VueMarkdownPreview.use(vuepressTheme, {
  // VueMarkdownEditor.use(createMermaidPlugin());
  Prism,
});

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(VueMarkdownEditor);
app.use(VueMarkdownPreview);  

app.mount('#app');

// 挂载到vue实例
app.config.globalProperties.$http = request;
