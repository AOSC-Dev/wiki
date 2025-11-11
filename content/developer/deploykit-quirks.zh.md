+++
title = "DeployKit 机型规避数据格式"
description = ""
+++

# 格式说明

规避配置使用 TOML 格式编写，内容如下：

```toml
[model]
# 两种匹配方式：
#
# - dmi：使用 DMI 信息进行匹配，此处指的是 modalias - 机型别名，一般足够判定
#        机型级别的规避
# - path：使用系统路径特征，尤其是 sysfs 虚拟文件系统中的文件特征进行判断
type = [dmi|path]

# 下列 path_pattern/dmi_pattern 不可同时指定

# 匹配某个路径是否存在（一般为 sysfs 下的虚拟文件），可使用通配符
#
# 下例匹配 LEFI 设备
#
# 如指定 type = path 则此项必填
path_pattern = "/sys/firmware/lefi"

# 匹配 DMI 信息，使用 /sys/class/dmi/id/modalias 内容，可使用通配符
#
# 例如 Loongson XA61200 的 modalias 内容为：
#
#   dmi:bvnLoongson:bvrLoongson-UDK2018-V4.0.05756-prestable202405:bd05/23/24145323:svnLoongson:pnLoongson-3A6000-HV-7A2000-1w-V0.1-EVB:pvrToBeFilledByO.E.M:rvnToBeFilledByO.E.M:rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:rvrToBeFilledByO.E.M:cvnLoongson:ct3:cvrToBeFilledByO.E.M:skuToBeFilledByO.E.M:
#
# 此处可匹配板型：
#
#   dmi:*svnLoongson:*pnLoongson-3A6000-HV-7A2000-1w-V0.1-EVB:*
#
# 抑或具体的主板版本
#
#   dmi:*svnLoongson:*rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:*
#
# 如指定 type = dmi 则此项必填
dmi_pattern = "dmi:*svnLoongson:*rnLoongson-3A6000-HV-7A2000-1w-EVB-V1.21:*"

[quirk]
# 执行规避命令，预期命令已设置有执行位（如命令为脚本则须正确定义 shebang）
command = "/usr/share/deploykit-backend/quirks/loongson-xa61200/quirk.bash"

# 跳过某个或多个步骤，用于处理已知无法完成的步骤（数组形式）
#
# 查阅 deploykit-backend: install/src/lib.rs 中的 enum InstallationStage 即可
# 获取步骤列表
#
# 此项选填；下例为跳过 GRUB 安装及 SSH 密钥生成
skip_stages = ["InstallGrub", "GenerateSshKey"]
```

# 文件摆放

规避配置应放置在 `/usr/share/deploykit-backend/quirks` 路径下，并以单级子目录进行分类：

```
- /usr/share/deploykit-backend/quirks
    - ./loongson-xa61200                    # 机型
        - ./quirk.toml                      # 规避配置
```