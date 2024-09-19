//const shell = require('shelljs') 
const child_process = require('child_process')
const process = require('process')
const fs = require('fs')

function getLog () { 
    //let _cmd = `git log -1 --date=iso --pretty=format:'{"commit": "%h","author": "%aN","date": "%ad","message": "%s"}'` ;
    // 将当前工作目录切换到 userservice_web 目录
    process.chdir('.\\userservice_web')
    // 该命令获取最近的 10 条非合并提交记录，并以特定格式输出
    let _cmd = `git log -10 --no-merges --dense --format="%n>>%h | %ai | %s"`
    return new Promise((resolve, reject) => { 
        //shell.exec(_cmd, (code, stdout, stderr) => { 
        //  child_process.exec 方法执行 Git 命令
        child_process.exec(_cmd, (code, stdout, stderr) => { 
            if (code) { 
                reject(stderr) 
            } else {
                resolve(stdout)
                //resolve(JSON.parse(stdout)[0]) 
            }
        }) })
}

async function commit(lastCommitHash) { 
    let _gitLog = await getLog()
    // 查找日志中是否包含指定的最后一次提交哈希值 lastCommitHash，如果找到，则截取该哈希值之前的日志部分
    const index = _gitLog.indexOf(`>>${lastCommitHash}`);
    if (index !== -1) _gitLog = _gitLog.substr(0, index);
    console.log(_gitLog)
    // 最近一次提交的hash值：从去除空白后的字符串中提取从索引 2 到索引 9（不包括索引 9）的子字符串。这通常是一个简短的提交哈希值。
    const commit = _gitLog.trimStart().slice(2, 9)
    // process.argv：这是一个数组，包含了启动 Node.js 进程时传递的命令行参数。
    // .slice(2)[0]：跳过前两个默认参数（node 可执行文件路径和脚本文件路径），获取第三个参数（即用户传递的第一个参数），这通常是分支名称。
    const branchName = process.argv.slice(2)[0];
    // 该命令返回当前分支的名称。
    const localBranchName = child_process.execSync('git rev-parse --abbrev-ref HEAD')
    //const lastCommitHash = child_process.execSync('git rev-parse HEAD')
    // 信息写入 changeLog.txt 文件中。最后，将生成的 changeLog.txt 文件复制到 build 目录下。
    fs.writeFileSync('./changeLog.txt', `Branch: ${branchName || localBranchName}\nCommit: ${commit}\n\n改动: \n${_gitLog}`, {encoding: 'utf-8'});
    fs.cp('./changeLog.txt', './build/changeLog.txt',(err) => {});
} 


commit(lastCommitHash = '03f2f08')
