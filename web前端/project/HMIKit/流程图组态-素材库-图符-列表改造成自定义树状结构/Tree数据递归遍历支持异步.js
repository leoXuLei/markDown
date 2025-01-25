const tree = [
  {
    children: [
      {
        children: [
          {
            id: 22163,
            name: "test12181",
            type: "cmi",
            path: "TEST1212/test1218/test12181",
            desc: "",
            graph: [
              {
                id: 95189360181277,
                hostId: 22163,
                code: "VIEW95189360181277",
                name: "新建_图符12181323",
                desc: "",
                type: 5,
                creationTime: 1734499405807293,
                creator: "xulei",
                lastWriteTime: 1734499465072875,
                modifier: "xulei",
                resourcePath: "views/22163/新建_图符12181323.pic",
                template: "",
                preview: "",
                unsaved: false,
              },
            ],
          },
          {
            id: 22186,
            name: "test112182",
            type: "cmi",
            path: "TEST1212/test1218/test112182",
            desc: "",
            graph: [
              {
                id: 95288144429085,
                hostId: 22186,
                code: "VIEW95288144429085",
                name: "新建_图符12181325",
                desc: "",
                type: 5,
                creationTime: 1734499522453716,
                creator: "xulei",
                lastWriteTime: 1734499620277158,
                modifier: "xulei",
                resourcePath: "views/22186/新建_图符12181325.pic",
                template: "",
                preview: "",
                unsaved: false,
              },
              {
                id: 95288144429086,
                hostId: 22186,
                code: "VIEW95288144429086",
                name: "新建_图符12190938",
                desc: "",
                type: 5,
                creationTime: 1734572344159557,
                creator: "xulei",
                lastWriteTime: 1734572373881686,
                modifier: "xulei",
                resourcePath: "views/22186/新建_图符12190938.pic",
                template: "",
                preview: "",
                unsaved: false,
              },
            ],
          },
          {
            children: [
              {
                children: [
                  {
                    id: 22195,
                    name: "test1218311",
                    type: "cmi",
                    path: "TEST1212/test1218/test12183/test121831/test1218311",
                    desc: "",
                    graph: [
                      {
                        id: 95322504167546,
                        hostId: 22194,
                        code: "VIEW95322504167546",
                        name: "新建_图符12192014",
                        desc: "",
                        type: 5,
                        creationTime: 1734572410389417,
                        creator: "xulei",
                        lastWriteTime: 1734572467992173,
                        modifier: "xulei",
                        resourcePath: "views/22194/新建_图符12192014.pic",
                        template: "",
                        preview: "",
                        unsaved: false,
                      },
                    ],
                  },
                ],
                id: 22194,
                name: "test121831",
                type: "cmi",
                path: "TEST1212/test1218/test12183/test121831",
                desc: "",
                graph: [
                  {
                    id: 95322504167453,
                    hostId: 22194,
                    code: "VIEW95322504167453",
                    name: "新建_图符12181328",
                    desc: "",
                    type: 5,
                    creationTime: 1734499711685954,
                    creator: "xulei",
                    lastWriteTime: 1734499803123627,
                    modifier: "xulei",
                    resourcePath: "views/22194/新建_图符12181328.pic",
                    template: "",
                    preview: "",
                    unsaved: false,
                  },
                  {
                    id: 95322504167454,
                    hostId: 22194,
                    code: "VIEW95322504167454",
                    name: "新建_图符12190939",
                    desc: "",
                    type: 5,
                    creationTime: 1734572410389417,
                    creator: "xulei",
                    lastWriteTime: 1734572467992173,
                    modifier: "xulei",
                    resourcePath: "views/22194/新建_图符12190939.pic",
                    template: "",
                    preview: "",
                    unsaved: false,
                  },
                ],
              },
            ],
            id: 22190,
            name: "test12183",
            type: "cmi",
            path: "TEST1212/test1218/test12183",
            desc: "",
          },
        ],
        id: 22159,
        name: "test1218",
        type: "cmi",
        path: "TEST1212/test1218",
        desc: "",
        graph: [
          {
            id: 95172180312093,
            hostId: 22159,
            code: "VIEW95172180312093",
            name: "新建_图符12190936",
            desc: "",
            type: 5,
            creationTime: 1734572217895161,
            creator: "xulei",
            lastWriteTime: 1734572267771909,
            modifier: "xulei",
            resourcePath: "views/22159/新建_图符12190936.pic",
            template: "",
            preview: "",
            unsaved: false,
          },
          {
            id: 95172180312094,
            hostId: 22159,
            code: "VIEW95172180312094",
            name: "新建_图符12190937",
            desc: "",
            type: 5,
            creationTime: 1734572279120120,
            creator: "xulei",
            lastWriteTime: 1734572315812693,
            modifier: "xulei",
            resourcePath: "views/22159/新建_图符12190937.pic",
            template: "",
            preview: "",
            unsaved: false,
          },
        ],
      },
    ],
    id: 21335,
    name: "TEST1212",
    type: "AREA",
    path: "",
    desc: "",
  },
];

// 【遍历一】Tree深度优先递归遍历-支持异步操作
export const treeDepthFirstTraversalAsync = async (treeNode, callback) => {
  if (Array.isArray(treeNode)) {
    return Promise.all(
      treeNode.map((node) => treeDepthFirstTraversalAsync(node, callback))
    );
  }

  // 对当前节点应用回调函数
  const newNode = await callback(treeNode);

  // 如果当前节点有子节点，则递归映射子节点
  if (Array.isArray(newNode?.children)) {
    newNode.children = await Promise.all(
      newNode.children.map((child) =>
        treeDepthFirstTraversalAsync(child, callback)
      )
    );
  }

  return newNode;
};

const waitFiveSeconds = async (param) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(param);
    }, 5000);
  });
};

const waitThenSeconds = async (param) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(param);
    }, 10000);
  });
};

// 格式化小于10的数字
function formatNumsLessTen(num) {
  return `${num < 10 ? `0${num}` : num}`;
}
// 格式化显示年月日-时分
function handledDate(date = new Date()) {
  // 年
  const Y = date.getFullYear();
  // 月
  const M = date.getMonth() + 1;
  // 日
  const D = date.getDate();
  // 格式化显示年月日
  const formatedDate = `${Y}/${formatNumsLessTen(M)}/${formatNumsLessTen(D)}`;
  // 时
  const Hours = date.getHours();
  // 分
  const Minutes = date.getMinutes();
  // 秒
  const Seconds = date.getSeconds();

  // 格式化显示年月日 时分秒
  const formatedTime = `${formatedDate}${"  "}${formatNumsLessTen(
    Hours
  )}:${formatNumsLessTen(Minutes)}:${formatNumsLessTen(Seconds)}`;
  // return formatedDate;
  return formatedTime;
}

const testTreeAsync = async () => {
  try {
    if (tree?.length > 0) {
      const finallRes = await treeDepthFirstTraversalAsync(
        tree,
        async (treeNode, levelIndex) => {
          return new Promise(async (resolveOut) => {
            // 若CM节点包含图符，则处理图符预览preview
            if (Array.isArray(treeNode?.graph) && treeNode?.graph.length > 0) {
              const handledGraphs = await Promise.all(
                treeNode?.graph?.map((graphItem, graphIndex) => {
                  return new Promise(async (resolve) => {
                    console.log(
                      `   111(节点层级是${levelIndex})(有图符列表的节点下的第${graphIndex}个图符)${handledDate()}开始执行异步waitFiveSeconds :>> graphItem`,
                      `${treeNode.path}_${graphItem.name}`
                    );
                    const res = await waitFiveSeconds(
                      `${graphItem.name}&${graphItem.resourcePath}`
                    );

                    console.log(
                      `   111(节点层级是${levelIndex})(有图符列表的节点下的第${graphIndex}个图符)${handledDate()}结束执行异步waitFiveSeconds :>> 调用结果res`,
                      res
                    );

                    resolve({
                      ...graphItem,
                      preview: res,
                    });
                  });
                })
              );
              return resolveOut({
                ...treeNode,
                graph: handledGraphs,
              });
            }

            console.log(
              `222(节点层级是${levelIndex})(没有图符列表的节点)${handledDate()}开始执行异步waitThenSeconds :>> treeNodeItem`,
              `${treeNode.name}_${treeNode.path}`
            );
            const res = await waitThenSeconds(
              `${treeNode.name}&${treeNode.path}`
            );
            console.log(
              `222(节点层级是${levelIndex})(没有图符列表的节点)${handledDate()}结束执行异步waitThenSeconds :>> 调用结果res`,
              res
            );
            return resolveOut(treeNode);
          });
        }
      );

      console.log("最终执行完tree的遍历 :>>");
      console.log("结束执行--------------------------------");
    }
  } catch (error) {
    logger.error("error: {}", error)();
  }
};

console.log("开始执行--------------------------------");

testTreeAsync();

// 一：目前测试结果，【遍历一】方式处理，对于Tree，上一层级调用完waitFiveSeconds并返回后，
// 下一层才会开始调用waitFiveSeconds，返回后，下下一层才会开始调用，最后一层调用完成后，才会走到`最终执行完tree的遍历 :>> finallRes`，即第一层2个一起开始执行，第二层5个一起开始执行，第三层1个开始执行

// 但是第一层2，第二层5，第三层1，跟所处结构又不一样，
// Tree中结构是第一层2，第二层3，第三层2，第四次1

// 好像是因为第二层第三个节点没有graph，所以没有进入到waitFiveSeconds，所以没有执行打印，而是直接进入其后代，其后代有graph，所以会先执行其同步代码，也就是打印和等待。

// 打印结果顺序如下：

// 开始执行--------------------------------
// 222(节点层级是1)(没有图符列表的节点)2024/12/20  09:51:52开始执行异步waitThenSeconds :>> treeNodeItem TEST1212_
// 222(节点层级是1)(没有图符列表的节点)2024/12/20  09:52:02结束执行异步waitThenSeconds :>> 调用结果res TEST1212&
//    111(节点层级是2)(有图符列表的节点下的第0个图符)2024/12/20  09:52:02开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218_新建_图符12190936
//    111(节点层级是2)(有图符列表的节点下的第1个图符)2024/12/20  09:52:02开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218_新建_图符12190937
//    111(节点层级是2)(有图符列表的节点下的第0个图符)2024/12/20  09:52:07结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12190936&views/22159/新建_图符12190936.pic
//    111(节点层级是2)(有图符列表的节点下的第1个图符)2024/12/20  09:52:07结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12190937&views/22159/新建_图符12190937.pic
//    111(节点层级是3)(有图符列表的节点下的第0个图符)2024/12/20  09:52:07开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test12181_新建_图符12181323
//    111(节点层级是3)(有图符列表的节点下的第0个图符)2024/12/20  09:52:07开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test112182_新建_图符12181325
//    111(节点层级是3)(有图符列表的节点下的第1个图符)2024/12/20  09:52:07开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test112182_新建_图符12190938
// 222(节点层级是3)(没有图符列表的节点)2024/12/20  09:52:07开始执行异步waitThenSeconds :>> treeNodeItem test12183_TEST1212/test1218/test12183
//    111(节点层级是3)(有图符列表的节点下的第0个图符)2024/12/20  09:52:12结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12181323&views/22163/新建_图符12181323.pic
//    111(节点层级是3)(有图符列表的节点下的第0个图符)2024/12/20  09:52:12结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12181325&views/22186/新建_图符12181325.pic
//    111(节点层级是3)(有图符列表的节点下的第1个图符)2024/12/20  09:52:12结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12190938&views/22186/新建_图符12190938.pic
// 222(节点层级是3)(没有图符列表的节点)2024/12/20  09:52:17结束执行异步waitThenSeconds :>> 调用结果res test12183&TEST1212/test1218/test12183
//    111(节点层级是4)(有图符列表的节点下的第0个图符)2024/12/20  09:52:17开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test12183/test121831_新建_图符12181328
//    111(节点层级是4)(有图符列表的节点下的第1个图符)2024/12/20  09:52:17开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test12183/test121831_新建_图符12190939
//    111(节点层级是4)(有图符列表的节点下的第0个图符)2024/12/20  09:52:22结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12181328&views/22194/新建_图符12181328.pic
//    111(节点层级是4)(有图符列表的节点下的第1个图符)2024/12/20  09:52:22结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12190939&views/22194/新建_图符12190939.pic
//    111(节点层级是5)(有图符列表的节点下的第0个图符)2024/12/20  09:52:22开始执行异步waitFiveSeconds :>> graphItem TEST1212/test1218/test12183/test121831/test1218311_新建_图符12192014
//    111(节点层级是5)(有图符列表的节点下的第0个图符)2024/12/20  09:52:27结束执行异步waitFiveSeconds :>> 调用结果res 新建_图符12192014&views/22194/新建_图符12192014.pic
// 最终执行完tree的遍历 :>>
// 结束执行--------------------------------
