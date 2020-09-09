+++
title = "p-vector"
description = "DEB 软件仓库管理器 p-vector"
date = 2020-05-04T03:36:26.143Z
[taxonomies]
tags = ["infra"]
+++

<!-- Needs update: BAD translation -->

# 简介

P-vector 是 AOSC OS 的 DEB 软件仓库管理工具，常用于生成索引文件与分析打包错误。

# 用法

`p-vector config.yaml (scan|release [--force]|sync|analyze [full]|reset [pv|sync])`

* `scan`：扫描软件包目录并载入数据库。
* `release`：为 APT 生成 `Packages`、`InRelease` 和 `Contents` 文件。
* `sync`：从 packages.aosc.io 下载 SQLite 数据库并将其中的数据转移到 PostgreSQL 数据库中。
* `analyze`：分析打包错误。
* `reset`：删除数据表。

# 数据库

p-vector 使用 PostgreSQL 作为数据库，我们强烈建议您使用最新版的 PostgreSQL。除此之外，您需要在配置文件的 `db_pgconn` 指明数据库连接字符串。

## 数据表

### p-vector 内置的数据表

这些数据表包含生成索引文件与分析打包错误所需的信息。 

* pv_repos：软件仓库信息
	* name\*：主键
	* realname：名称（不含分支信息）
	* path：DEB 软件仓库路径
	* testing：稳定性级别（0-2）
	* branch：stable、testing、explosive
	* component：main、bsp、opt
	* architecture：all、amd64...
* pv_packages：DEB 软件包元信息
	* package\*
	* version\*
	* repo\*
	* architecture
	* filename
	* size
	* sha256
	* mtime：DEB 文件修改时间
	* debtime：`control` 文件修改时间
	* section：同 DEB 包内信息
	* installed_size：同 DEB 包内信息，以 KiB 为单位
	* maintainer
	* description
	* \_vercomp：用于排序的相对版本
* pv_package_duplicate：有着相同包名、版本和仓库的 DEB 文件
	* （同上，主键是文件名）
* pv_package_dependencies
	* package\*
	* version\*
	* repo\*
	* relationship\*：依赖、冲突...
	* value：同 DEB 包内信息
* pv_package_sodep：DEB 文件的动态库依赖项
	* package
	* version
	* repo
	* depends：0 提供，1 依赖
	* name：libfoo.so
	* ver：.1.2.3
* pv_package_files：DEB 软件包内文件
	* package
	* version
	* repo
	* path：不带有前缀 `/`
	* name
	* size
	* ftype：文件类型，例如 reg、dir、lnk、sock、chr、blk、fifo
	* perm：文件访问权限信息
	* uid
	* gid
	* uname
	* gname
* pv_package_issues：打包错误信息
	* id\*
	* package
	* version
	* repo
	* errno：[问题报告](@/developer/packaging/qa-issue-codes.zh.md)
	* level：-1 致命错误，0 一般错误，1 警告
	* filename
	* ctime：创建日期
	* mtime：修改日期 (same package and file, different detail)
	* atime：校验日期
	* detail：json 信息
* pv_issues_stats：打包错误统计日志
	* repo
	* errno
	* cnt：问题数量
	* total：软件包数量
	* updated
* pv_dbsync：软件包站点数据库同步状态
	* name：数据库名称
	* etag
	* updated

### 软件包站点导入的数据表

下面的数据表均从 packages.aosc.io 软件包站点导入。

#### abbs.db
* trees
* tree_branches
* packages
* package_dependencies
* package_duplicate
* package_spec
* package_versions
* dpkg_repo_stats

#### \*-marks.db
* repo_branches
* repo_committers
* repo_marks
* repo_package_basherr
* repo_package_rel

#### piss.db
* package_upstream
* upstream_status
* anitya_link
* anitya_projects

## 视图

视图信息主要来源软件包站点的 `abbs.db`。

* v_packages：源码树的最新软件包
* v_package_upstream：软件包的上游版本和 URL 信息

## 物化视图

从下面的视图您可以获取到有关软件包及其关系的更多信息，但是视图的生成需要一定的成本。

* v_packages_new：版本号数值最大的软件包
	* （同 pv_packages）
* v_dpkg_dependencies：DPKG 依赖项解析信息
	* package
	* version
	* repo
	* relationship
	* nr：依赖项数量
	* deppkg：依赖项信息
	* deparch：依赖项架构信息
	* relop：版本关联信息
	* depver：版本需求
	* depvercomp：版本比较需求
* v_so_breaks：`dep_package` 有依赖破坏风险的软件包
	* package：依赖的软件包信息
	* repo
	* soname
	* sover
	* sodepver：其它软件包所需的 sover 信息
	* dep_package：反向依赖信息
	* dep_repo
	* dep_version

# 分析

问题检测机制的具体实现如下：

* 101：在数据表 repo_package_basherr 中找到软件包名称为空的条目
* 102：在数据表 repo_package_basherr 中找到软件包名称非空（包名在 `defines` 有定义）的条目
* 103：正则表达式 `^[a-z0-9][a-z0-9+.-]*$`。Debian 的策略要求包名称至少要两个字符，但我们在这里为 `r` 设置了一个例外
* 301：debtime 为空。如果我们不能打开 DEB 文件，我们将无法从 `control` 获取 mtime
* 302：文件大小小于 10M 且小于软件包大小中间值的三分之一
* 303：pool/(lib)\<initial letter\>/\<package name\>\_\<version\>\_\<architecture\>.deb
* 311：正则表达式 `^.+ <.+@.+>$`
* 321：软件包不包含 /usr/local 或 `^(bin|boot|etc|lib|opt|run|sbin|srv|usr|var)/?.*` 中的文件
* 322：可执行且名称非 NEWS、ChangeLog、INSTALL、TODO、COPYING、AUTHORS、README、README.md、README.txt、empty、placeholder、placeholder.txt、.\*、\_\_init\_\_.p\* 的空文件
* 323：uid>999 或者 gid>999
* 324：/bin、/sbin、/usr/bin 出现非可执行文件和目录
* 401：找到构建时依赖不存在的软件包
* 402：数据表 package_duplicate 非空
* 411：找到运行时依赖不存在的软件包
* 412：数据表 pv_package_duplicate 非空
* 421：找到满足以下特征的软件包对 p1 和 p2：p1 和 p2 有相同的一般文件，p1 != p2，p1.arch=p2.arch 或者 p2.arch=all，p1.repo_component=p2.repo_component，p1.testing <= p2.testing；这也包含了 DEB 包的依赖项、冲突项和替代项
* 431：找到提供了软件包 p1 需要的库文件的软件包 p2。如果版本匹配失败，那么查找相同的 so-name。返回模糊匹配结果和空匹配结果
* 432：递归查找提供了软件包 p1 需要的库文件的软件包 p2。返回在 PKGDEP 中找不到的库文件提供者。不要向 aosc-os-core 报告缺少的依赖项。如果p1 dep p2 dep p3 且 p1 sodep p3，但 p1 没有在 p3 上声明 PKGDEP，则不会报告这种情况。如果 p1 dep/sodep p2 dep p3 且 p1 sodep p3，但 p1 没有在 p3 上声明 PKGDEP，则会报告这种情况