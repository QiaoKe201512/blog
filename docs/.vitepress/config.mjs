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
    outline: [2, 7],
    nav: [
      { text: 'K8S', link: '/k8s/index' },
      { text: '公有云', link: '/cloud' },
      { text: 'DEVOPS', link: '/devops/index' },
      { text: '监控', link: '/monitor/index' },
      { text: 'Linux', link: '/linux/index' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/QiaoKe201512' }
    ],

    sidebar: {
      '/k8s/': k8s_sidebar(),
      '/devops/': devops_sidebar(),
      '/cloud/': cloud_sidebar(),
      '/monitor/': monitor_sidebar(),
      '/linux/': linux_sidebar()
    }
  }
})


// 读取指定目录生成侧边栏
function cloud_sidebar(){

  return [
    {
      text: '首页',
      link: '/cloud/index'
    },
    {
      text: '阿里云SLB配置使用',
      link: '/cloud/aliyun-slb'
    }
  ]
}

function linux_sidebar(){

  return [
    {
      text: '首页',
      link: '/linux/index'
    },
    {
      text: 'iptables 介绍',
      link: '/linux/iptables-intro'
    },
    {
      text: 'Linux 存储管理 ubuntu22.04',
      link: '/linux/linux-storage-management'
    },
    {
      text: 'Linux 软件管理  ubuntu22.04',
      link: '/linux/linux-software-manage-ubuntu'
    }
  ]
}

function devops_sidebar (){

  return [
    {
      text: '首页',
      link: '/devops/index'
    },
    {
      text: 'python 模块化管理',
      link: '/devops/python-module'
    },
    {
      text: 'Python 异常处理体系',
      link: '/devops/python-exception-system'
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
    },
    {
      text: 'Kubernetes v1.30 配置安装 基于docker ubuntu22.04',
      link: '/k8s/Kubernetes-v1.30-docker'
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
    },
    {
      text: '监控数据采集方法论',
      link: '/monitor/monitor-methods'
    },
    {
      text: '监控数据采集方式和原理',
      link: '/monitor/monitor-data-collect'
    }
  ]
}
