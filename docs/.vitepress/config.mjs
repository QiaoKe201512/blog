import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "乔钶的技术之旅",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '云原生', link: '/cloud-native' },
      { text: '公有云', link: '/public-cloud' },
      { text: 'devops', link: '/devops' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/QiaoKe201512' }
    ],
  },
  srcDir: 'src',
  base: '/blog/'
})
