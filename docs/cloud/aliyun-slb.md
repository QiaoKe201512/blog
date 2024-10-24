### 阿里云SLB配置使用<Badge type="tip" text="阿里云" />

#### 什么是SLB

是对云上流量进行按需分发的服务。通过将流量分发到不同的后端服务来扩展应用系统的服务吞吐能力，消除单点故障并提升应用系统的可用性。分为ALB和NLB。

| 特性             | 应用型负载均衡 ALB                      | 网络型负载均衡 NLB                     |
|----------------------|---------------------------------------------|-------------------------------------------|
| 产品定位         | 强大的 7 层处理能力与丰富的高级路由功能 聚焦 HTTP、HTTPS 和 QUIC 应用层协议 | 超强的 4 层处理能力与大规模 SSL 卸载功能 聚焦 TCP、UDP 和 TCP SSL 协议 |
| 产品性能         | 面向应用层交付，支持弹性伸缩，单实例最大支持 100 万 QPS | 面向网络层交付，支持弹性伸缩，单实例最大支持 1 亿并发连接 |
| 功能特性         | 丰富7层特性，基于内容的路由HTTP标头改写、重定向、重写、限速等 | 丰富4层特性，千万级TCP SSL卸载、基于监听限速支持连接风暴抑制、全端口监听、安全组等 |
| 云原生支持       | 阿里云官方云原生 Ingress 网关，支持流量拆分、镜像、灰度发布和蓝绿测试等 | 支持云原生业务场景，与阿里云 ACK/SAE/K8S 等容器服务结合使用 |
| 典型应用场景     | 场景1: 互联网应用 7 层高性能自动弹性场景 | 场景1: 四层大流量高并发业务场景      |
|                      | 场景2: 音视频应用大流量低时延场景     | 场景2: 物联网、车联网等 IoT 业务入口 |
|                      | 场景3: 云原生应用金丝雀蓝绿发布场景   | 场景3: 多活容灾、IDC 云上出入口场景 |

#### 如何使用

##### 后端服务器

![image-20241019204203145](/image-20241019204203145.png)

##### 监听器和转发规则

![image-20241019204245897](/image-20241019204245897.png)

##### ALB监听器和转发规则

| 转发规则类型      | 描述                                     |
|-------------------|------------------------------------------|
| 路径条件          | 根据请求的路径进行转发（如 `/api/*`）。 |
| 主机条件          | 根据请求的主机名进行转发（如 `example.com`）。 |
| HTTP 头条件       | 根据请求中的 HTTP 头进行转发（如 `User-Agent`）。 |
| 查询字符串条件    | 根据请求的查询字符串进行转发（如 `?id=123`）。 |
| HTTP 方法条件     | 根据请求的 HTTP 方法进行转发（如 `GET`、`POST`）。 |

| 转发动作          | 描述                                     |
|-------------------|------------------------------------------|
| 转发到目标组      | 将请求转发到指定的目标组。              |
| 重定向            | 将请求重定向到另一个 URL（可指定状态码）。 |
| 返回固定响应      | 返回自定义的固定响应（如 404、500 状态码）。 |
| 访问日志          | 记录访问日志以供分析和调试。            |
##### NLB 监听器和转发规则

| 转发规则类型      | 描述                                     |
|-------------------|------------------------------------------|
| 协议条件          | 根据请求的协议进行转发（如 TCP、UDP）。  |
| 端口条件          | 根据请求的端口进行转发（如 80、443）。   |
| IP 地址条件       | 根据客户端的 IP 地址进行转发。           |

| 转发动作          | 描述                                     |
|-------------------|------------------------------------------|
| 转发到目标组      | 将请求转发到指定的目标组（可以是实例、IP 地址或 Lambda 函数）。 |
| 返回固定响应      | 返回自定义的固定响应（如 404、500 状态码，适用于 ALB）。 |

#### 使用场景



| 负载均衡类型      | 主要使用场景                                     | 替代的传统软件            |
|-------------------|--------------------------------------------------|---------------------------|
| 应用型负载均衡 ALB | - Web 应用程序的 HTTP/HTTPS 流量管理            | - Apache HTTP Server      |
|                   | - API 服务的流量控制                            | - Nginx                   |
|                   | - 微服务架构中的流量分配                        | - HAProxy                  |
|                   | - 需要高级路由功能（如内容路由、主机路由等）    | - 传统硬件负载均衡器      |
|                   | - 灰度发布和金丝雀发布                         |                           |
| 网络型负载均衡 NLB | - 高并发 TCP/UDP 流量处理                       | - 传统硬件负载均衡器      |
|                   | - 物联网（IoT）应用的流量入口                  | - IPVS（IP Virtual Server） |
|                   | - 需要静态 IP 地址的场景                       | - F5 BIG-IP               |
|                   | - 实时通信应用（如游戏、视频流）               | - 传统软件负载均衡器      |
