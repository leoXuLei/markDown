# `.bat`文件介绍

`.bat` 文件是 Windows 中的一种批处理文件，**批处理脚本的扩展名为`.bat`。这些文件是用于自动化执行 Windows 中的一组操作或命令的文本文件。批处理文件可以包含一系列命令，以执行诸如复制文件、删除文件、更改目录、打开应用程序等任务。它们也可以用来设置环境变量，创建文件夹，备份数据等**。

批处理文件通常使用 Windows 命令提示符窗口运行。用户可以通过双击`.bat` 文件来运行批处理脚本，也可以在命令提示符窗口中手动执行它们。**批处理文件可以简化复杂的任务，减少操作错误，从而提高生产率**。

# 命令语法

- `echo`：控制台输出文本。语法：`echo message` 或者 `echo %variable%`
- `set`：用于定义和修改环境变量。语法：`set variable=value`。使用变量：`echo %variable%`
- `if`：用于在不同条件下执行不同的命令或程序。语法：

  ```bash
  if condition command
  if not condition command
  if condition (command1) else (command2)
  ```

  ```bash
  ::> 如果该文件夹已存在，则删除它并重新创建。
  if exist %fileName% (rd /s/q "%fileName%")
  md %fileName%
  ```

- `for`：用于循环处理一系列值。语法：

  ```bash
  for %%variable in (set) do command [command-parameters]
  for /f ["options"] %%variable in (file-set) do command [command-parameters]
  ```

- `cmd`：命令行执行，参数 `/c` 表示告诉 cmd 执行完指定的命令后关闭命令提示符窗口。
- `md`：`mkdir`，`md %fileName%`命令用于创建一个新目录，目录名由变量 `%fileName%` 指定。
- `xcopy`：递归地复制，参数 `/s` 表示复制所有子目录和文件。

# 命令行命令

- `rd`：`rmdir`，参数 `/s` 表示递归删除，`/q` 表示静默模式，不提示确认。

# Tips

- 注释语法：注释可以使用 `REM` 或 `::` 标记进行添加。
