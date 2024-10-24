### Linux 存储管理  ubuntu22.04<Badge type="tip" text="linux"/>

#### 如何添加一块磁盘并投入使用？

##### 1. 添加磁盘

![image-20241020142016955](/image-20241020142016955.png)

##### 2. 检测磁盘

```bash
# 查看磁盘信息
lsblk | grep sdb 
```

![image-20241020142933354](/image-20241020142933354.png)

##### 3. 磁盘分区

fdisk **进行分区操作**

```bash
fdisk /dev/sdb
```

**创建分区并选择分区类型**

| 特性         | 主分区                      | 扩展分区                    |
|--------------|-----------------------------|-----------------------------|
| 数量限制     | 最多 4 个                   | 只能有 1 个                 |
| 存储类型     | 可用于存储操作系统、应用程序和数据 | 不能直接存储数据，需创建逻辑分区 |
| 启动支持     | 可以直接作为启动分区       | 不能直接作为启动分区       |
| 灵活性       | 不如扩展分区灵活           | 可创建多个逻辑分区，增加灵活性 |
| 使用场景     | 适合简单的磁盘结构，少量分区需求 | 适合需要多个分区的复杂磁盘结构 |

**创建一个5G大小的主分区**

![image-20241020144249721](/image-20241020144249721.png)

**查看分区信息**

![image-20241020144355849](/image-20241020144355849.png)

##### 4. 格式化

**选择文件系统类型**

| 特性                     | ext4                               | XFS                               |
|--------------------------|------------------------------------|-----------------------------------|
| **类型**                 | 日志文件系统                      | 日志文件系统                     |
| **最大文件系统大小**     | 1 EB                               | 8 EB                              |
| **最大文件大小**         | 16 TB                              | 8 EB                              |
| **性能**                 | 对小文件读写性能良好              | 优化大文件和并发写入性能         |
| **延迟分配**             | 支持                                | 支持                              |
| **文件系统检查**         | 使用 `fsck`，可能需要较长时间     | 在线扩展和检查，速度较快         |
| **适用场景**             | 一般服务器、桌面和嵌入式设备     | 数据库、大文件存储、文件服务器  |
| **快照支持**             | 支持（通过 LVM 或其他工具）       | 原生支持                          |
| **灵活性**               | 较好，适合多种使用场景             | 非常灵活，特别适合大规模存储     |
| **碎片整理**             | 可能需要定期整理                   | 自动处理碎片                      |
| **可扩展性**             | 有限，较大时性能可能下降           | 设计上为大规模存储优化          |

```bash
mkfs.ext4 /dev/sdb1
```

##### 5. 挂载

**创建挂载点**

```bash
 mkdir -p /data/k8s
```

**挂载**

```bash
 mount /dev/sdb1 /data/k8s
```

![image-20241020145355862](/image-20241020145355862.png)

##### 6. 配置自动挂载

**修改 `/etc/fstab` 配置**

```bash
UUID=7d4f3abc-d92f-4660-a9eb-472f225ed212  /data/k8s ext4 defaults 0 2
```

#### LVM存储管理方案

##### 1. LVM 关系图示

![image-20241020153952745](/image-20241020153952745.png)

![image-20241020154014304](/image-20241020154014304.png)

##### 2. 如何配置

**安装 LVM 工具**

```bash
sudo apt-get install lvm2
```

**准备物理卷（PV）**

```bash
sudo pvcreate /dev/sdb1
sudo pvs
```

![image-20241020162509366](/image-20241020162509366.png)

**创建卷组（VG）**

```bash
sudo vgcreate myvg /dev/sdb1
sudo vgs
```

![image-20241020162611543](/image-20241020162611543.png)

**创建逻辑卷（LV）**

```bash
sudo lvcreate -n mylv -L 50G myvg
sudo lvs
```

![image-20241020162735966](/image-20241020162735966.png)

**格式化逻辑卷**

```
sudo mkfs.ext4 /dev/myvg/mylv
```

**挂载逻辑卷**

```bash
sudo mkdir /data/k8s
sudo mount /dev/myvg/mylv /data/k8s
```

##### 3. 如何扩容

**增加物理卷空间 添加磁盘到VG**

```bash
sudo pvcreate /dev/sdc
sudo vgextend myvg /dev/sdc
```

![image-20241020165046217](/image-20241020165046217.png)

 **扩展逻辑卷**

将逻辑卷 `mylv` 扩展 5G

```
sudo lvextend -L +10G /dev/myvg/mylv
```

![image-20241020165150996](/image-20241020165150996.png)

**扩展文件系统**

```bash
sudo resize2fs /dev/myvg/mylv

df -h
```

![image-20241020165414583](/image-20241020165414583.png)





