## 安装zabbix并启用高可用模式<Badge type="tip" text="zabbix" />

### 安装准备

OS: Ubuntu22.04

数据库: Mysql

前端服务器: Nginx

官方下载流程: https://www.zabbix.com/download

组件间关系图

![2024-07-22_103935](/2024-07-22_103935.png)

### 开始安装

1. #### 安装Mysql 和 zabbix server

   安装Mysql 默认是8.0的版本；设置开机自启；启动Mysql

   ```bash
   apt install -y mysql-server
   systemctl enable mysql
   systemctl start mysql
   systemctl status mysql
   ```

   默认安装未设置root密码，登录设置密码

   ```bash
   mysql -uroot -p
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';
   flush privileges;
   ```

   安装zabbix server

   ```bash
    apt install -y zabbix-server-mysql # zabbix server
    apt install -y zabbix-sql-scripts  # zabbix数据库脚本
   ```

   创建zabbix 数据库

   ```bash
   mysql -u root -p "你的密码"
   # 数据库
   create database zabbix character set utf8mb4 collate utf8mb4_bin;
   create user zabbix@localhost identified by '密码'; 
   grant all privileges on zabbix.* to zabbix@localhost identified by '密码'; 
   flush privileges; 
   quit
   
   #将zabbix 数据库表 导入数据库
   zcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql --default-character-set=utf8mb4 -uzabbix -p zabbix
   ```

   配置Zabbix Server

   ```bash
   vim /etc/zabbix/zabbix_server.conf
   
   # 修改以下内容
   DBName=zabbix 
   DBUser=zabbix
   DBPassword=密码
   
   # 启动zabbix-server
   systemctl enable zabbix-server 
   systemctl start zabbix-server
   systemctl status zabbix-server
   
   # 查看日志是否有报错
   tail -f /var/log/zabbix/zabbix_server.log
   ```

2. #### 配置zabbix 前端页面

   安装 zabbix 前端组件

   ```bash
   apt install -y zabbix-frontend-php 
   apt install -y zabbix-nginx-conf
   ```

   配置nginx 监听

   ```bash
   vim  /etc/zabbix/nginx.conf 
   # 将文件中的这两行注释去掉
   listen 8080;
   server_name example.com;
   ```

   重启zabbix-server 并配置nginx php-fpm开机自启

   ```bash
   systemctl restart zabbix-server zabbix-agent nginx php8.1-fpm
   systemctl enable nginx php8.1-fpm
   ```

   访问前端页面，并配置 地址 `http://你的IP/zabbix`

   选择语言

   ![image-20240722123443104](/image-20240722123443104.png)

   zabbix预检需求，所用的都需要OK

   ![image-20240722123625166](/image-20240722123625166.png)

   配置数据库连接参数

   ![image-20240722123746648](/image-20240722123746648.png)

   配置server名；时区；前端主题

   ![image-20240722123859782](/image-20240722123859782.png)

   准备开始安装

   ![image-20240722123945159](/image-20240722123945159.png)

   完成安装

   ![image-20240722124010303](/image-20240722124010303.png)

   登录默认用户名，密码

   ```bash
   Username: Admin 
   Password: zabbix
   ```

### 启用zabbix server高可用

​	架构图

​	![image-20240722124514876](/image-20240722124514876.png)

​	预先准备：配置三台虚拟机

| 主机名     | IP          | 用途          |
| ---------- | ----------- | ------------- |
| zabbix-ha1 | 192.168.0.2 | zabbix server |
| zabbix-ha2 | 192.168.0.3 | zabbix server |
| db         | 192.168.0.4 | 数据库        |
| VIP        | 192.168.0.1 | keepalive     |

1. #### 配置数据库

   与单机节点配置不同之处在于需要为两台server节点和VIP配置账户; 其他步骤均相同

   ```sql
   create database zabbix character set utf8mb4 collate utf8mb4_bin;
   create user zabbix@'192.168.0.1' identified by 'password';
   create user zabbix@'192.168.0.2' identified by 'password';
   create user zabbix@'192.168.0.5' identified by 'password';
   grant all privileges on zabbix.* to 'zabbix'@'192.168.0.1' identified by 'password'; grant all privileges on zabbix.* to 'zabbix'@'192.168.0.2' identified by 'password'; grant all privileges on zabbix.* to 'zabbix'@'192.168.0.5' identified by 'password'; flush privileges; quit
   ```

2. #### 配置zabbix 集群节点

   配置zabbix-ha1

   ```bash
   vim /etc/zabbix/zabbix_server.conf
   
   # 修改以下内容
   DBHost=192.168.0.4
   DBPassword=password
   HANodeName=zabbix-ha1
   NodeAddress=192.168.0.2
   ```

   配置zabbix-ha2

   ```bash
   vim /etc/zabbix/zabbix_server.conf
   
   # 修改以下内容
   DBHost=192.168.0.4
   DBPassword=password
   HANodeName=zabbix-ha2
   NodeAddress=192.168.0.3
   ```

   重启zabbix server并配置开机自启

   ```bash
   systemctl enable zabbix-server 
   systemctl start zabbix-server
   ```

3. #### 配置Nginx高可用

在两个台节点安装 `keepalived` `nginx`

```bash
apt install -y keepalived
apt install -y nginx
```

配置zabbix-ha1 的keepalived

```bash
vim /etc/keepalived/keepalived.conf

# 文件内容
vrrp_track_process chk_nginx { 
    process nginx
    weight 10
}
vrrp_instance zbx_1  { 
  state MASTER 
  interface ens192 
  virtual_router_id 51 
  priority 244 
  advert_int 1 
  authentication {
    auth_type PASS 
    auth_pass "密码"
  } 
  track_process { 
    chk_nginx
  }
  virtual_ipaddress {
    192.168.0.1/24
  }
}
```

配置zabbix-ha2 的keepalived

```bash
vim /etc/keepalived/keepalived.conf

# 文件内容
vrrp_track_process chk_nginx { 
    process nginx
    weight 10
}
vrrp_instance zbx_1  { 
  state BACKUP 
  interface ens192 
  virtual_router_id 51 
  priority 243 
  advert_int 1 
  authentication {
    auth_type PASS 
    auth_pass "密码"
  } 
  track_process { 
    chk_nginx
  }
  virtual_ipaddress {
    192.168.0.1/24
  }
}
```

启动keepalived并配置开机自启

```bash
systemctl enable nginx keepalived 
systemctl start nginx keepalived
```

4. ### 配置zabbix 前端相关

访问`http://192.168.0.1/zabbix` 其他步骤和单机部署相同 这一步主机名配置为`zabbix-ha1`

![image-20240722140822898](/image-20240722140822898.png)

停止 zabbix-ha1 的nginx服务

```bash
systemctl stop nginx
```

再次访问`http://192.168.0.1/zabbix` 将此处的主机名配置为 zabbix-ha2

![image-20240722141050075](/image-20240722141050075.png)

将zabbix-ha1的nginx 重新启动

```bash
systemctl start nginx
```

### 登录zabbix平台查看ha情况

1. 停止zabbix-ha1的nginx 服务器

   ```bash
   systemctl stop nginx
   ```

2. 停止zabbix-ha1的zabbix server

   ```bash
   systemctl stop zabbix-server
   ```

   