## 个人信息

- 姓名：徐磊
- 出生年月：1996.11.30
- 工作经验：4 年前端 React 项目开发经验
- Github：https://github.com/leoXuLei
- 期望岗位：Web 前端开发工程师
- 期望薪资：面谈
- 期望城市：杭州
- 联系方式：
  - 手机：15722928126
  - 邮箱：1611928589@qq.com
  - 微信：xl1611928589

## 教育背景

- 2014.09 ~ 2018.06&emsp;&emsp;南京邮电大学 / 软件工程 / 本科

<!-- **工作内容包括：** 需求移交理解、静态页面绘制、功能逻辑开发、接口联调对接、Bug 修复代码优化、参与推动项目进行等。 -->

## 技能清单

- 熟悉 HTML、CSS、JS、ES6、TypeScript，了解 HTML5、CSS3 新特性。
- 熟悉 React、Hooks、Dva、Redux 等相关技术栈。
- 熟悉 Antd 组件库，能够基于 Antd 封装复杂 UI/业务组件。
- 熟悉使用 sass、styled-components、lodash、xlsx、moment、bignumber 等库。
- 熟悉使用 Echarts 等可视化图表库开发各种图表。使用过 Canvas 绘制海报。
- 熟悉使用版本控制工具 Git/Gitlab。
- 了解 Webpack，能够从零开始搭建配置 React 项目开发环境。
- 了解前端性能优化、代码优化，致力于提高产品性能和用户体验。
- 了解基本数据结构和算法。了解面向对象编程思想。

## 项目经历

### HMIKit

**项目描述：** 二维流程图低代码编辑器。

**内容职责：** 主要参与需求开发、bug 修复。负责的功能模块有：

- 流程图组态-素材库-图符列表改造（把平铺的图符列表改造成`自定义树状结构`：包含图符列表的 CM 树，每层树节点都是 CM 节点，其下要么展示图符列表，要么展示下一层树节点，要么两者都有，支持搜索筛选图符、树节点。）
- 面板是流程图画面的一种可复用的显示单元

### 控制系统监控软件项目

**项目描述：** 是下一代的 ECS 控制系统监控软件（Web），参与的应用有监控基座 basic-web、监控趋势 trend-web 等项目。

**内容职责：** 主要参与需求开发、bug 修复。负责的功能模块有：

- **趋势分屏表格**：通过对首列拖拽实现整行拖拽出 Table 的效果，并与其它列表交互，从而切换分屏序号。支持 Ctrl 点选、Shift 多选。（拖拽效果使用`react-sortable-hoc`库实现。点选通过给 Table 设置行属性`onRow.onClick`实现。）
- **趋势 SSPA 集成模式下剥离 supcond2 组件库**。（使用`externals`配置选项从输出的 bundle 中排除指定依赖 A（`@supcon/supcond2`），转而使用基座应用中的依赖 B（`@ecsnext/supcond`）。A 和 B 只是名称不同，实际是同一个依赖，通过`resolve.alias`配置别名来对应上。）
- **趋势 SSPA 集成模式下剥离资源选择器组件**。（封装`MyResExplor`组件，若是集成模式，使用全局 Api 调用`globalBasicAPI?.openResSelector`，否则按需动态引入组件`const module = await import( /* webpackChunkName: "ResExplor" */ "../CxResExplor");`，会多打包出两个`xx.chunk.js`文件，变相实现了集成模式下的组件剥离。）
- **趋势全局主题功能**：趋势控件组态期设置中有全局主题开关，开启后监控期才会使用全局主题，使用颜色字段的页面，通过自定义 Hook 来获取颜色字段色值（`const useColorGlobalTheme = (colorFieldKey: string): string => { }`若组态选择了全局主题，则从当前主题的颜色变量中映射出对应的色值，否则还是从 store 中取颜色字段值）。 这样既能手动设置颜色字段的值，也能控制颜色字段是否跟随全局主题。
- **命令式加载电子签名组件**：监控基座应用中的 API，用于操作前的验证身份，函数式调用，返回 Promise。（使用`ReactDOM.render`+`ReactDOM.unmountComponentAtNode`在 dom 节点上挂载和卸载弹窗组件。组件内通过`Steps` 步骤条+`Form` 表单实现按先后步骤填写表单功能）
- **监控基座应用 Electron 端新增 Api**：三个 Api，用于获取本机 ip 地址、计算机名、操作系统版本，通过 OS 模块查询相关信息（`require("os")`），实现流程：主进程注册&实现 Api（`ipcMain.handle("get-local-ip", getAllIPAddresses);`）、预加载脚本中暴露 Api（`contextBridge.exposeInMainWorld("electronAPI", { getLocalIP: () => ipcRenderer.invoke("get-local-ip") });`）、渲染进程/应用中使用 Api。

**技术栈：** konva（之前是 zrender）、React、TypeScript、paho-mqtt、i18next、styled-components、big.js、ramda、moment 等。

**难点收获：**

- 位号趋势图实时渲染
  - 主要功能是添加订阅位号，变化推送实时数据，渲染位号实时趋势图，还支持：浮动游标、多 Y 轴、最值、实时/历史切换、趋势数据表格、趋势分屏、趋势打印、位号表格设置等功能。
  - X 轴时间跨度`timeSpan`：默认是 20Min，时间窗口可选择（1Min、2Min、10Min、20Min、30Min、2H、8H、1D、7D、30D），也可自定义 X 分钟、小时、天。
  - 步长`timeStep`：表示趋势图多久变化一次，根据时间跨度计算出来，时间跨度每增加 1min(向上取整)，步长增加 50ms。即`nextTimeStep=((Min*60)/60)*50ms`
    `nextTimeStep=((20*60)/60)*50=1000ms=1S`，步长就是 1s，即每隔 1s，X 轴往前走一个点。
  - 绘制点数`counts`：根据时间跨度和步长计算出来，时间跨度是 20Min 时，`counts=timeSpan/timeStep=20*60/1=1200`，即趋势图中每个位号最多绘制 1200 个点。
- 趋势数据中心重构。
  - **去除重复、多余、无意义的遍历操作**。
    - 如重构前：先遍历每个位号的 1200 个点，从步长缓存池中取数据填入真实数据，再遍历每个位号的 1200 个点，不是真实点则补点拉平线。重构后：遍历每个位号的 1200 个点，真实点跳过，若 X 轴步长时间点对应的有缓存数据则使用，否则补点拉平线（复用前一个点的数据）。
    - 如计算 X 时间轴数组，重构前：`this.xTimes = [...Array(counts).keys()].map(k => this.stepTimeInterval ? this.stepTimeInterval.startTime + this.timeStep * k : 0  );`。重构后使用一个 for 循环，`for (let countIndex = 0; countIndex < counts; ++countIndex) { xxx }`。
  - **不需要的数据点不缓存，需要用到的数据点接收到时就处理好并存好，用的时候直接取**：实时数据步长缓存池`StepRdCache`（Map），以`stepTime`（按步长向上取整）为 key，value 从存数组（每个数据点都存）改成存当前步长时间内最晚的点。
  - **不重新生成所有真实点**。1200 个点的遍历塞缓存最新值，只在请求历史数据之后做一次。后面每到步长时间更新时，不重新生成 1200 个点，只更新 1200 个点的前几个和后几个点：删头增尾。因为中间的点要么是历史数据，要么是之前的实时数据不会再变了，要变的就是删最前面的旧点、增最后面的新点。
  - **存储位号的实时最值方案**。请求历史数据后遍历生成真实点过程中记录最大/小值，后面每到步长时间更新时，即删头增尾时更新位号（趋势线）的最大最小值。
- （TODO）微前端框架，各个模块作为子应用集成在父基座应用中，方便了扩展维护。抽离公共模块依赖，方便复用提高加载速度。

### 批生产控制系统-配方编辑器项目

<!--


在批量生产中，配方组态是批量控制的基础，产品的生产加工是按配方规定的顺序及操作参数进行的，工艺工程师会在配方编辑软件中进行配方的搭建和维护。

配方中的程序由上至下分为：配方（recipe）、设备单元（unit）、操作（operation）和阶段（phase）四个层次。工程师需要根据生产工艺将复杂的工序流程抽象为层次清晰、易于组态的程序模型

 -->

**项目描述：** RecipeEditor 是中控技术批生产控制系统 VxBatch 中配方编辑软件的 web 化项目，可以解决客户端软件安装繁琐、升级维护成本高、扩展性差、使用体验不友好的问题。

**内容职责：** 负责项目的前端开发，配合团队成员，参与推动项目开发迭代流程。主要负责的功能模块有：

- 原料管理、产品管理、配方管理：配方列表，进行配方状态流转。
- 配方详情页（配方头、公式、工序，设备）
  - 工序：左侧为树形目录展示当前主配方的各层次节点，若左侧 Tree 选中 Recipe/Unit/Operation/Phase 层某个节点后，右侧展示该层该节点的 SFC 程序图、程序列表、参数列表或原料绑定。
  - SFC 顺序功能流程图：是一种图形编程语言，主要由步、有向连线、转移条件、跳转和动作等元素组成，支持顺序、并行、选择、循环和跳转结构。工程师需要根据生产工艺将复杂的工序流程抽象为层次清晰、易于组态的 SFC 程序模型，SFC 程序组态支持的功能有：增加顺序步、增加分支、扩展分支、删除、撤销、恢复等。
- 系统功能：
  - 国际化
  - 配方详情页多页签功能
  - 配方详情页数据修改后未保存跳转路由拦截功能
  - 用户操作权限管理：各页面模块的权限（如预览、编辑、操作等权限）使用自定义 Hook 实现，方便维护复用。
  - 编辑位号表达式自定义 Hook`useInputCursor`：TextArea 指定光标位置并插入文本。
- 通用组件：
  - 导入、导出 CSV 组件。右键菜单组件。可拖动弹窗组件。
  - 可配置表单，控件支持：Text、Input、InputNumber、Select、SelectInput（支持自输入选项的 Select）、Checkbox、自定义业务控件等。
  - 可编辑表格，单元格控件支持同上。
  - 可拖动两列布局组件（通过设置分界元素可拖动，监听 mousemove 和 mouseup 事件实现）。
  - SFC 程序图截图导出组件（使用`dom-to-image`依赖，传入 DOM 生成 SVG）。

**技术栈：** Umi、React、TypeScript、Antd、axios、lodash、immer 等。

**难点收获：**

- SFC 程序图的实现基于 Antv/X6 图编辑库，是个独立的 NPM 包，供配方编辑器和监控两个项目使用，整个实现过程较为复杂，大致流程如下。
  - SFC 程序渲染流程如下
    - （1）**自定义 SFC 元素**：以 X6 内置的图形（如矩形、边、圆）为基础，自定义满足业务需求的 SFC 元素，如步节点、转换节点、分支等元素，此过程包含设置元素结构（形状、宽高、连接桩）、定制渲染样式、配置默认选项等。
    - （2）**初始化画布 Graph 实例**：设置基本配置，如指定画布容器、设置拖拽平移和缩放级别，还有设置元素事件监听，如元素选中、取消选中、双击等。
    - （3）**解析 XML 格式的 SFC 程序图数据为 JSON 格式** ：解析配方程序 Tree 数据中当前选中树节点的 sfc 属性，属性值是 XML 格式，处理得到描述各种 SFC 元素的 JSON 数据（记为 fmtSFCData），每个元素数据包含元素的 id、元素的类型、输入输出元素的 id 等信息。
    - （4）**从起始元素开始递归遍历，生成元素实例并设置位置**：解析 fmtSFCData，生成 SFC 元素实例。每个元素都包含其输入、输出元素的信息，任一元素的位置依赖于其输入元素的位置和尺寸，从起始步节点元素开始递归遍历，遍历过程中根据上一个元素的位置、尺寸来设置当前元素的位置，并将上一个元素的输出端口与当前元素的输入端口相连接。最终得到 X6 渲染 SFC 程序所需的数据 graphData。
    - （5）**渲染 SFC 程序**：X6 根据 graphData 在画布上渲染出 SFC 程序。
  - SFC 程序编辑更新流程如下（以新增步节点为例）：
    - （1）**编辑 SFC 元素**：选中 SFC 程序中某个步节点，根据其类型从配置模板中获取到要新增的元素类型并生成对应的元素实例，在当前操作元素和其输出元素中间，插入新增的 SFC 元素（类似链表中插入节点），即更新描述各种 SFC 元素的 JSON 数据（记为 fmtSFCData）。
    - （2）**解析 JSON 格式的 SFC 程序图数据为 XML 格式** ：将 JSON 格式的 SFC 程序图数据 fmtSFCData 反向解析成 XML 格式的。
    - （3）**更新配方程序 Tree**：深拷贝配方程序 Tree 原数据，找到当前操作步节点后，更新其 sfc 属性、子程序列表。
    - （4）**画布重新渲染**：配方程序 Tree 数据更新后，触发 React 组件更新，SFC 程序会再次走上述的渲染流程，画布重新渲染，最新的 SFC 程序呈现在界面上。
- 除了 SFC 依赖包是与另一个前端共同开发维护外，整个 RecipeEditor 项目是自己从 0 到 1 独立开发完成。项目周期 11 个月（22 年 07 月~23 年 05 月）。

### 内部项目 V2.0 系统

**项目描述：** 该系统定位是项目管理、团队协作工具（类似于 Jira、Teambition），该系统提供了从“需求->开发->测试->发布->运营”端到端的协同服务和研发工具，可视化的项目进展和协作，井然有序的任务管理，旨在打造端到端一体化的研发协作流程。助⼒开发者提升研发效能，持续快速交付有效价值。系统用户为公司内各个产品、部门的 PM、研发、测试等。

**内容职责：** 参与项目的前端开发，配合产品、前后端协作，参与推动项目开发迭代流程（需求评审、技术评审、任务拆分估时、早会同步进度暴露问题、开发自测联调、测试、上线）。主要负责参与的功能模块有：

- 效能度量报表（表单查询、表格和图表切换展示及导出、数据公式、权限控制）
- 空间
  - 成员管理（新增移除、权限设置、任务转交）
  - 里程碑管理（节点新增父/子阶段属性，可编辑节点表格限制阶段内可拖动调整顺序，**预览 Steps 中标识展示节点的父/子阶段**）
  - 文件管理（新增迭代视图、**新增文件/文件夹复制/移动到目标文件夹**、新增文件标签设置）
- 迭代页（列表支持拖动调整宽度、列表数据繁杂响应慢改成分两次请求配合骨架屏、详情跳转自动展开并滚到视区）
- 工作项：需求、任务、缺陷、里程碑及对应的详情弹窗（工作项自定义表单控件如关联内容、关联项目、代码模块等，工作项动态日志、评论）
- 管理后台：业务线组织架构管理（人员、空间）、任务转交
- 每日待办、离职待转交弹窗：工作项、审批项、里程碑
    <!-- - 其它：视频图片引导、kong 网关配置 -->
    <!-- - 设置节点的顺序、必填、跳过、检查项/审批项 -->
  <!-- **工作内容个人职责：** -->

**技术栈：** 基于 React 技术栈的 next 项目，Hooks、TS、Antd、react-dnd、styled-components 等。

**难点收获：**

- 项目庞大、业务逻辑复杂：

  - 为保证项目模块清晰、易于扩展维护，项目采用微前端架构，整个项目被拆分为一个主项目，九个子项目，其中有一个子项目为组件库，一个子项目是 Git submodule ，为类型申明及少量组件库。各个子应用可独立开发、部署测试、交付上线。
  - 各空间的工作项的类型、字段、状态流程可配置。
    - 具体字段的 name、key、options、rules 可配置
    - 每个状态的可变更状态可配置

- 项目开发迭代流程规范标准，迭代节奏稳定可控。
- 作为项目管理工具的开发者同时也是使用者，对软件研发管理流程有了更深刻的认识和理解。
- 项目使用 Hooks 和 TS，之前都是写 Class 组件，有一定学习上手成本。
- 内部项目 UI 交互的细节不明确，需要自己去思考、设计、权衡。
  <!-- - 内部项目管理系统的用户都是公司内部团队，会有定制化需求掺杂在日常迭代中，日常还需要处理用户反馈、答疑等。 -->
  <!-- - 为保证项目模块清晰、易于扩展维护，项目采用微前端架构，整个项目被拆分为一个主项目（容器应用，将各个子应用集成起来），数十个子项目，其中一个子项目是组件库，作为 UI/业务组件库供所有项目使用，公共状态（如登录用户信息、角色权限信息等）也会保存在主应用中，子应用可共享。各个子应用可独立开发、部署测试、交付上线。 -->

### 结构金融管理系统

**项目描述：** 该系统是为了解决客户业务流程：产品发行管理（产品录入、流程审批、合约生成、用印归档等）、产品存续期管理（生命周期事件、计算统计、报告管理等）、资产管理（资产录入、到期兑付、核算收益等）等遇到的记录统计分析难度大、流程不规范、操作风险高、发行效率低、管理难度大等业务难点痛点。
**内容职责：** 独立负责国泰君安证券结构金融五期项目的前端开发。同产品、多名后端协作开发，能够独立解决开发中遇到的问题。
**技术栈：** React、Hooks、Umi、Antd、lodash、bignumber、moment、xlsx 等。
**难点收获：**

- 重构产品录入模块时通过模块化可配置设计解决了以下难点:

  - 各种期权结构产品字段数量多（ 60- 80 个控件）。
  - 除手动录入外还需支持 Excel 导入（数据映射、异常校验、容错处理）。
  - 大量控件的编辑控制、展示与否联动、控件值联动/校验、自定义控件封装、提交校验确认等。

  <!-- ==最终采用模块化可配置的方案: 根据产品关键字段期权结构将各期权结构的对应字段通过以期权结构为 key， 对应字段为 value 的字典形式管理，字段对应控件，控件统一管理==。 -->

- 用户使用体验优化：

  - 收益凭证列表表格列 150 个字段为了显示美观、使用友好，实现表格列显示配置（支持筛选、勾选、全选、按模块要素批量勾选/反选）及配置本地持久化保存功能。

- 在具体业务场景中，开发者需要思考：如何设计组织实现功能、降低代码耦合性、提高复用性和可维护性。
- 思考业务需求压力、代码质量把控、开发效率之间的制约关系。
<!-- - 初次接触逻辑复杂流程繁琐的收益凭证业务，需同产品、后端紧密沟通交流反馈。 -->

<!-- 虽然项目中使用的是已经封装完善经过其它项目实践过的模块/组件。但 -->

### 场外衍生品交易管理系统（BCT）

**内容职责：** 参与 BCT 光大证券、申万证券等多个项目的前端开发迭代。参与的模块/功能有：审批组管理、风控设置、簿记和试定价页面添加期权结构及要素等。
**难点：** 导出数据权限树形数据为包含样式的 Excel(支持任意层级树形数据导出、导出的 Excel 支持行列合并和定制样式)。

### 巧客力小程序项目

**项目描述：** 该微信小程序是房源管理维系客户的工具。具体功能有：房源新建管理、在线聊天、房源分享（分享好友、朋友圈、房源海报）、访客管理、小组管理、名片模板管理等。用户为房产经纪人。
**内容职责：** 同产品、前后端、测试协同开发，参与推动项目迭代进程。主要负责参与的功能模块有：房源详情、房源海报、房源采集、小组、会员、在线支付等。
**技术栈：** React、Dva、Taro、Canvas 等。
**难点收获：**

- 遇到的难点有 Canvas 绘制房源海报功能、在线支付功能。
- 随着开发维护的模块业务逻辑不断增加糅合，逐渐意识到了抽离、封装、复用代码的重要性。

### 巧房 V20 系统项目

**项目描述：** PC 项目 V20 SaaS 系统，致力于提升房产中介运营及管理效率。系统功能有交易订单管理、营销房源发布、业绩查询、行程量数据统计、财务结算等。
**内容职责：**

- 参与地图找房模块的开发，页面调用百度地图 API，通过缩放拖拽地图实现在城区、商圈、楼盘三个层级下聚合点位、多边形覆盖物的展示和交互效果及画圈找房功能。
- 负责考勤组设置、班次设置模块开发。后端提供的是基础接口，BFF 层需要前端处理，把多个基础接口数据处理成可用数据。
- 参与商圈精耕地图模块开发。

**技术栈：** React、Dva、Antd。

<!-- ### CRM5 项目

参与上海证券、海通证券等 CRM5 项目。
**项目描述：** 系统页面多为表单表格、各种形式的图表数据展示。
**内容职责：** 根据页面 UI 图进行结构布局、功能逻辑实现、接口联调对接、测试优化等。
**技术栈：** React、Dva、Antd、Echarts 等。 -->

<!-- ##

### 江苏金陵科技公司前端实习生

测试工作：不能盲目开展，任何测试都应该以需求为基础，以测试用例为导向进行实施，
自动化测试与手工测试：自动化测试代替不了手工测试，目的仅仅在于让测试人员从繁琐重复的机械式测试过程解脱出来，把时间和精力投入到更有价值的地方，从而挖掘更多的产品缺陷，

编写 Python 脚本操作数据库是用的 sqlite
 -->

## 工作经历

- 2021/07 ~ 2022/03&emsp;&emsp;&emsp;杭州涂鸦信息技术有限公司

  - 业务：全球化物联网开发平台服务商
  - 部门：效能部
  <!-- - 离职原因：裁员 -->

- 2020/03 ~ 2021/06&emsp;&emsp;&emsp;上海同余信息科技有限公司
  - 业务：金融衍生品基础服务
  - 部门：解决方案部 BCT-Y 组
  <!-- - 离职原因：个人发展、职业规划 -->
- 2018/06 ~ 2020/01&emsp;&emsp;&emsp;上海巧房信息科技有限公司
  - 业务：房产 SaaS 系统
  - 部门：研发二部
  <!-- - 离职原因：裁员 -->

<!-- 证明人: 姚长剑 `13758296595`
证明人: 胡亚 `17802595052`
证明人: 神嘉熙 `13560300783`
证明人: 蔡秋雨 `15850922852` -->

<!-- - 说辞：毕业之后去的巧房，在小程序项目干了8个月 -->

<!-- - 2018/06 ~ 2019/06&emsp;&emsp;&emsp;上海顶点软件股份有限公司
  - 业务：金融 CRM 系统
  - 部门：华东交付零售线
  - 离职原因：团队变动、职业规划 -->

## 职业规划

本人具备一定的抗压能力、学习能力、团队协作沟通能力。近四年的前端开发工作经历使得我的专业技能得到了提升，能够参与并推动前端项目的开发迭代流程， 但距离成为一名优秀的高级前端开发工程师还需要项目积累和技术沉淀，比如基于业务场景封装组件/模块、封装自己的组件库/项目脚手架、前端工程化、数据结构和算法等方面都有待加强。希望不久的将来能熟练使用前端相关技术栈解决具体业务问题、推动项目进程、发挥前端职业价值、提升个人竞争力。

<!-- ## 项目展示

![](./../../web前端/1-典型需求/imgs/typical-needs-file-copy-move-to-folder1.png)
![](./../../web前端/1-典型需求/imgs/typical-needs-css-project-milestones-stage-3.png) -->
