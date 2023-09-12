# `nginx -t`

**【命令解释】**

`nginx -t` 是一个用于测试 nginx 配置文件语法的命令。

执行 `nginx -t` 命令将会检查当前的 nginx 配置文件是否存在语法错误。如果配置文件中存在语法错误，命令行会显示相应的错误消息，并指示具体错误的位置。

这个命令对于在修改或创建 nginx 配置文件后，验证配置文件的正确性非常有用。如果配置文件通过了语法检查，那么可以使用 nginx 命令重新加载或启动 nginx 服务器，使新的配置生效。

**【实际执行】**

```bash
# 测试nginx配置文件语法：输入nginx后按Type，然后 输入-t
.\nginx.exe -t


nginx: the configuration file E:\nginx-1.21.6-other\nginx-1.21.6-other/conf/nginx.conf syntax is ok
nginx: configuration file E:\nginx-1.21.6-other\nginx-1.21.6-other/conf/nginx.conf test is successful
```
