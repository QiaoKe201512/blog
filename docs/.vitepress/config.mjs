import { defineConfig } from 'vitepress'
import { chineseSearchOptimize, pagefindPlugin } from 'vitepress-plugin-pagefind'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/blog/',
  lang: 'zh-cn',
  vite: {
    plugins: [pagefindPlugin({
      customSearchQuery: chineseSearchOptimize
    })],
  },
  head: [
    ['link', { rel: 'icon',  type: "image/png", sizes: "64x64",href: '/blog/logo.png' }]
  ],
  title: "乔钶的技术随笔",
  description: "SRE 云原生 公有云 DEVOPS",
  themeConfig: {
    outline: [2, 4],
    nav: [
      { text: 'K8S', link: '/k8s/index' },
      { text: '公有云', link: '/cloud' },
      { text: 'DEVOPS', link: '/devops/index' },
      { text: '监控', link: '/monitor/index' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/QiaoKe201512' }
    ],

    sidebar: {
      '/k8s/': k8s_sidebar(),
      '/devops/': devops_sidebar(),
      '/cloud/': cloud_sidebar(),
      '/monitor/': monitor_sidebar()
    }
  }
})


// 读取指定目录生成侧边栏
function cloud_sidebar(){

  return [
    {
      text: '首页',
      link: '/cloud/index'
    }
  ]
}

function devops_sidebar (){

  return [
    {
      text: '首页',
      link: '/devops/index'
    }
  ]
}

function k8s_sidebar () {

  return [
    {
      text: '首页',
      link: '/k8s/index'
    },
    {
      text: 'Docker 网络',
      link: '/k8s/docker-network'
    },
    {
      text: 'Kubernetes 高可用集群二进制部署',
      link: '/k8s/kubernetes-bin-1.28.14'
    }
  ]
}

function monitor_sidebar() {

  return [
    {
      text: '首页',
      link: '/monitor/index'
    },
    {
      text: 'zabbix监控方式',
      link: '/monitor/zabbix-monitor-methods'
    },
    {
      text: 'zabbix生产高可用部署',
      link: '/monitor/zabbix-ha-deploy'
    },
    {
      text: 'zabbix snmp监控',
      link: '/monitor/zabbix-snmp'
    }
  ]
}
