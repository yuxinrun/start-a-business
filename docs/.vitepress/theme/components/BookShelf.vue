<script setup lang="ts">
interface Book {
  /** 中文书名（无正式中译本的书直接用英文原名，见 zh 栏说明） */
  title: string
  /** 原名；中文原创书与"原名即书名"的情况留空，不显示 */
  orig: string
  author: string
  /** 原版年份（事实表口径） */
  year: string
  /** 中译与版本坑：事实表点名过的才写，没给准的不显示 */
  zh: string
  /** 阶段标签，取自事实表"适合谁"里的阶段词 */
  stage: string
  level: 1 | 2 | 3 | 4 | 5
  /** 听读时长：事实表全部为估算 */
  minutes: string
  grade: string
  tag?: string
  who: string
  value: string
  /** 本站比市面书架多出来的一栏：读完容易得出什么错结论 */
  risk: string
}

// 12 本全部取自 .qoder/facts-books.md「书架卡（12 本）」一节，一本不多一本不少。
// 事实表划出去的一律不进组件：《一平米的帝国》（查无出处）、《创业家精神》（原版书名与年份未核实）、
// 《跨越鸿沟》《创业维艰》《从0到1》《从优秀到卓越》《基业长青》《原则》《这就是OKR》
// 《奈飞文化手册》《指数级增长》《The $100 Startup》，以及霍洛维茨 2026 新书（中文书名未取得）。
// 顺序按阶段排：先"有没有人付钱"，再"卖得动、也交接得出去"，最后才是"带人"。
const BOOKS: Book[] = [
  {
    title: 'The Mom Test',
    orig: '',
    author: 'Rob Fitzpatrick（罗伯特·菲茨帕特里克）',
    year: '2013',
    zh: '无中国大陆正式中译本（豆瓣仅英文原版条目）；市面所称"妈妈测试"多为课程、公众号自译。',
    stage: '还在验证',
    level: 1,
    minutes: '120–180 分钟',
    grade: 'B 方法论／无对照',
    tag: '验证阶段必读',
    who: '还在验证的人（事实表原话：性价比最高的第一本），以及刚有收入后要做客户回访、提价谈判的人；10 人以上要管团队与渠道的、纯技术平台没有终端客户可访的不适用。',
    value: '三条访谈禁令：不问"你觉得我这主意怎么样"、不问"你会不会买"、不问"如果……你愿意付多少"；只问过去发生过的具体事，每次访谈结束前索要一个能推进的承诺。',
    risk: '读完容易得出"我做了 8 个精心访谈，市场验证完成"。这本书只解决问得准不准，完全不管样本该选谁、要访多少人、结果怎么统计；它也没覆盖"客户聊得很好但就是不付钱"那一格，书中更没有引用任何实验或对照研究——它是技巧手册，不是研究结论。'
  },
  {
    title: '精益创业',
    orig: 'The Lean Startup',
    author: 'Eric Ries（埃里克·莱斯，IMVU 联合创始人／CTO）',
    year: '2011',
    zh: '两个同名中信译本页码不通用（2012 吴彤译 272 页／2026 全新修订版 覃斌健译 326 页）；《精益创业实战》是 Ash Maurya 的另一本书。',
    stage: '还在验证',
    level: 2,
    minutes: '360–420 分钟',
    grade: 'C+ 偏 C',
    who: '还在验证、刚有收入，想搞清楚"钱到底从哪来"这条因果链的人；不适合 50 人以上做流程管理，也不适合重资产、长周期项目照搬它的迭代节奏。',
    value: '把"要做什么"改写成 2 条可否证的假设，走开发—衡量—学习闭环：上线前先写下本轮预期数值，开工前先写下什么情况下转向。',
    risk: '"最小可用产品"最容易被读成"随便做个丑东西先上线"，而莱斯本人反复澄清 MVP 必须先有明确假设——中文语境里它几乎成了赶工的许可证。另一句流传的"用精益方法的公司存活率更高"，书里从未量化过：支撑基本是 IMVU 和被点名公司的自述，没有对照组、没有失败样本统计，"极端不确定性"的定义也偏宽，理论难以否证。'
  },
  {
    title: '精益创业实战',
    orig: 'Running Lean（第 3 版）',
    author: 'Ash Maurya（LeanStack 创始人，精益画布发明人）',
    year: '2012 初版／第 3 版 2019',
    zh: '两个人邮译本：2013 张玳译（第 2 版 193 页）、2023 王小皓译（第 3 版 364 页）；引页码必须注明版次，电商搜索里与《精益创业》高度混淆。',
    stage: '还在验证',
    level: 3,
    minutes: '约 480 分钟',
    grade: 'C+／B−',
    who: '要把莱斯的理念变成能打勾的表的人，以及第一次系统看单位经济的人；不适合 50 人阶段（不谈组织与预算），也不适合只想找灵感的人。',
    value: '精益画布 9 格：问题格写 3 个排序，UVP 要能被外行 5 秒复述；每格打信心 X 与重要性 Y，挑出"低信心×高重要性"那一格，安排本周 40 元以内的验证动作；90 天周期只攻 3 个最危险的假设。',
    risk: '容易读成"一页画布填完 = 验证过了"：作者自述"历经数以百计案例研究"，却没给出案例清单与筛选标准，无从复核；一页画布的强约束还会把长教育周期的 B2B、公益型项目直接挤到外面。工具可复核不等于效果可复核——这版定价值不值，取决于你是否真把那个 90 天周期跑完。'
  },
  {
    title: '重来',
    orig: 'Rework',
    author: 'Jason Fried & David Heinemeier Hansson（37signals／Basecamp 联合创始人）',
    year: '2010',
    zh: '中信 2010 李瑜偲译与 2018 精装两种；《重来3》对应 It Doesn\'t Have to Be Crazy at Work（2018）可确认，《重来2》的英文原名未确认，别把册次和英文书名硬对应。',
    stage: '还在验证',
    level: 1,
    minutes: '约 240 分钟',
    grade: 'B 一手／C 推广',
    who: '治"准备过度症"的人，独立开发者、设计师、工作室，以及主动想保持小的团队；已拿机构投资、背着对赌或增长目标的人、要带 20 人以上的人，不适合照它的口径执行。',
    value: '写"这个月我们不做的 5 件事"，而不是写计划；别写计划书，本周做出一个能收钱的最小交付，发给 20 个人；把人数上限和利润率挂钩。',
    risk: '它是短文集，每个观点都是断言、没有论证结构，很容易被当"口号集"消费掉。"不需要投资人""不必做市场调研""忽略竞争"是作者靠技术能力＋早期内容营销红利＋极低云成本换来的自我例外：硬件、医疗、合规行业照做代价巨大；而且一旦你要把动作交接给第二个人，"忽略竞争"这条就失效了。'
  },
  {
    title: '一人企业',
    orig: 'Company of One',
    author: 'Paul Jarvis（保罗·贾维斯，加拿大网页设计师／网络顾问）',
    year: '2019',
    zh: '电子工业 2020 高扬译是本书；武汉大学出版社 2021《一人公司起步的思维》译自作者更早的 Everything I Know，不是本书中译本；台版书名与译者未核实。',
    stage: '还在验证／刚有收入',
    level: 2,
    minutes: '约 360 分钟',
    grade: 'C 单案例自述',
    who: '还在验证想低成本起步的自由职业者、独立顾问、内容型工作室，且主动想停在 3 人以下的手艺人；要做规模化产品、已拿融资有增长义务的人不适合。',
    value: '写下"足够"的三个数——年度税后收入目标、每周工时上限、可接受的最大客户集中度——然后用它否决机会；be better, not bigger，本季度只设一个质量指标；现金、时间、技能各留最小冗余；把你的约束当卖点写进报价单。',
    risk: '它是"不扩张也成立"的存在性证明，最容易被读成"不扩张这条路更优"——书中没有任何关于一人公司存活率或收益分布的数据。上限（身体、平台改规则、单一技能被 AI 替代、客户过度集中）被"这是我主动选择"的叙事弱化了，而它的成功高度依赖既有技能和英文内容分发生态。它和《Traction》《指数级增长》是价值观级冲突，三本混读会互相拆台。'
  },
  {
    title: 'Traction',
    orig: '',
    author: 'Gabriel Weinberg（DuckDuckGo 创始人）& Justin Mares',
    year: '2015',
    zh: '未找到中国大陆正式中译本（豆瓣为英文原版）；《牵引力》《获客》《拉新：快速实现用户增长》均为书评／公众号自译或进口版商品名，须与《增长黑客》（Sean Ellis）区分。',
    stage: '刚有收入→10 人',
    level: 2,
    minutes: '约 360 分钟',
    grade: 'B−',
    who: '刚有收入、产品有了却没人买的人，以及 10 人阶段要把获客从"老板刷脸"变成可交接动作的人；还没确认有人愿意付钱的先回去读《The Mom Test》和精益画布，50 人阶段的组织问题也不在这本里。',
    value: 'Bullseye 三轮填表：硬性要求把 19 个渠道先全写进外环再往内拖，专治路径依赖；每个渠道只测一个动作，2 周后统一比 CPL／CAC；某渠道上限要达到目标量的 2–3 倍才准进内环；顺手写下 UGM 与 ROI 公式。',
    risk: '直接照搬会得出"你的渠道不存在"这个错误结论——清单是 2015 年美国互联网市场快照，中文市场的主渠道（微信生态、抖音、小红书、1688）书里一条都没有。反过来也容易把它当深度方法：原版豆瓣约 6.3 分，主要抱怨就是 19 章清单式罗列、每章都浅，它本质是渠道词典；样本是 40 余位成功创始人，全是幸存者，没有渠道效果的量化数据。'
  },
  {
    title: '鞋狗',
    orig: 'Shoe Dog',
    author: 'Phil Knight（菲尔·奈特，耐克创始人，注册会计师出身）',
    year: '2016',
    zh: '北京联合出版公司 2016 毛大庆译；台版书名不是《鞋狗》而是《跑出全世界的人》，其译者未核实。',
    stage: '刚有收入→10 人',
    level: 2,
    minutes: '约 600 分钟',
    grade: 'C 回忆录',
    who: '正被应收账款和库存压住的人（刚有收入到 10 人），做贸易、零售、有实物的生意的尤其对症；想从中提取"方法论"的人不适合——它只有故事，50 人阶段想找管理工具的也别在这本里翻。',
    value: '今天就能做三件事：建一张应收账款账龄表（0–30／31–60／60 天以上）并标出现金能撑几周；用"新增收入×平均账期÷365"算出这轮增长必须先垫付多少，再决定接单量上限；超出正常周销 8 周的备货，必须同时写好清货预案。',
    risk: '最危险的读法是把"近乎不要命的扩张"当方法——奈特自己承认多次踩在破产边缘，最后是靠后续融资成功才活下来，那是幸存者的结果，不是可复制的策略。回忆录的时间点和金额靠记忆、没有审计口径，还把日本廉价跑鞋进口潮、跑步热这些时代红利跟能力混写在一起。补一句：网传"《鞋狗》金句"里那句"痛苦＋反思＝进步"是达利欧《原则》的，不是他说的。'
  },
  {
    title: '创业必经的那些事 1',
    orig: 'The E-Myth Revisited',
    author: 'Michael E. Gerber（迈克尔·格伯，E-Myth Worldwide 创始人）',
    year: '1986 初版／2004 修订版',
    zh: '同书至少两个简体译名，最容易买错：中信 2010《创业必经的那些事1》王甜甜译，同内容另有以《突破瓶颈》为名的译本；《创业必经的那些事》《……2》是不同分册，台译《创业必懂》页码不通。',
    stage: '刚有收入→10 人',
    level: 2,
    minutes: '约 300 分钟',
    grade: 'C 寓言＋咨询经验',
    who: '第一次雇人、开始被琐事吞掉的人（刚有收入）和老板自己成了瓶颈的人（10 人），开餐饮、零售、服务门店的尤其对口；还在验证阶段的团队读它太早（过早写 SOP），高度依赖个人创作的独立顾问也不适合。',
    value: '用三重身份（创业者／管理者／专业人士）做一次 30 分钟时间盘点；给最重复的那件事写 1 页"位置说明书"；假设这家店是你准备卖出去的加盟店，用它做 5 个决定；本月清掉两个不能系统化的动作。',
    risk: '读完容易认定"小企业失败就是因为创始人是手艺人"——这个比例从未被量化：全书主体是寓言体叙事（馅饼店店主 Annie）加作者咨询经验，没有客户成功率数据，麦当劳之类是选择性赢家例子，把失败主要归因于创始人认知也偏简化。"特许经营思维"对创意、设计、咨询、研发这类高判断力工作适配很差，而"系统能替代人"和《奈飞文化手册》的人才密度主张是直接顶着来的。'
  },
  {
    title: '商战',
    orig: 'Marketing Warfare',
    author: 'Al Ries（艾·里斯）& Jack Trout（杰克·特劳特），定位理论创始人',
    year: '1986',
    zh: '有简体（机械工业出版社"定位经典丛书"），但译者与 ISBN 的对应关系未能确认，两条记录分别署不同译者——这里只认 ISBN，不写"某某译"这类组合。',
    stage: '刚有收入→10 人',
    level: 3,
    minutes: '约 420 分钟',
    grade: 'C 从业者叙事',
    who: '产品有差异化却仍然卖不动、要想清楚"我们到底是谁"的人（刚有收入到 10 人），做品牌、内容、投放的也相关；还在验证阶段的你还没有可占据的心智，50 人阶段想找组织工具的也不在这本里。',
    value: '心智阶梯别自己猜，去问 10 个目标客户；选一条品类、人群、场景都具体到能列出名单的短战线——一个词想得出三个以上，说明你还没定；小公司默认打侧翼战或游击战：如果你用的是老大的同一渠道、同一卖点、同一价格带，那就是拿进攻战的配置去打侧翼战的预算。',
    risk: '最容易被读成"选个词、喊句口号就算完成定位"——波特《什么是战略》（HBR 1996）批评的正是把营销话术当战略本身。那句常被引用的"2001 年被美国营销学会评为有史以来对美国营销影响最大的观念"是机构发的荣誉，不是同行评议或实证检验；中国区的"定位成功故事"（凉茶类品牌）多由特劳特／里斯中国公司自己撰写，属利益相关方陈述。它和精益学派互相否定，初学者最容易两头都做。'
  },
  {
    title: '创新者的窘境',
    orig: "The Innovator's Dilemma",
    author: 'Clayton M. Christensen（克莱顿·M·克里斯坦森，哈佛商学院教授，1952–2020-01）',
    year: '1997',
    zh: '简体版容易混：江苏人民 2001 旧译（署名不同）、中信 2010 胡建桥译、2014 修订版与 2020 珍藏版；《创新者的解答》《创新者的基因》《颠覆性创新》是四本不同的书，勿合并。',
    stage: '刚有收入→10 人',
    level: 4,
    minutes: '约 660 分钟',
    grade: 'A−',
    who: '正在选战场、要判断从哪类客户切入的人（刚有收入到 10 人），做技术类产品的尤其值得读；它不谈执行，别指望从中听"怎么做出伟大产品"；纯监管、资质驱动的行业也要小心——颠覆逻辑会被准入壁垒卡住。',
    value: '对首创业者最实用的是反向用法：不正面攻击在位者的核心客户，去服务他们主动放弃的那批客户；把行业里毛利率最低的那群人单独记账、单独定价，不许被主业务的毛利标准一票否决。',
    risk: '"颠覆性创新"进了大众语言，变成"任何大变化"的同义词——作者本人与同事多次公开限定：颠覆指从低端或新市场进入，性能起初更差但更便宜、更便捷；他 2015 年前后甚至说特斯拉不算颠覆性创新（后来改口指共享出行），iPhone 按严格定义属延续性／高端进入。更要紧的是，这本书解释的是"在位者为什么失败"，并不保证挑战者会成功：当进攻手册读，你会系统性低估自己的资金和渠道劣势。'
  },
  {
    title: '详谈',
    orig: '',
    author: '李翔（资深媒体人，得到 App 总编辑）',
    year: '2020 年起（各册年份不同）',
    zh: '中文原创、非译本，新星出版社／得到图书。已确认分册为 01 左晖、02 杨浩涌、03 沈鹏、05 赵鹏、07 杜国楹与《详谈：饶晓志》；完整分册清单未逐册核对，站内不列"全系列"，引用必须写清是哪一位被访者。',
    stage: '刚有收入→10 人',
    level: 1,
    minutes: '约 180 分钟／册',
    grade: 'C 一手口述',
    who: '想理解中国本土生意的真实约束——账期、渠道、行业周期——的人；不要在验证阶段把它当方法书读，想学管理体系的得另找工具书（一册只有一个人，给不出一套体系）。',
    value: '把它当"访谈式自学"的模板用：先写出对方的时间线，再问"当时你有哪些选项、为什么放弃其他几个、事后看哪里判断错了"；只提取决策规则，不提取结论；同一个人隔半年再访一次，才分得清"当时的说法"和"稳定的做法"。',
    risk: '幸存者视角：入选的是丛书自述的"这个时代优秀的商业实践者"，结构性地不含失败者样本，一册只有一个人、叙述未经第三方核验，外推性比《海底捞你学不会》更弱。被访行业（房产经纪平台、二手车、招聘、茶叶、盲盒潮玩）在出版后都经历了剧烈波动或政策变化，书里的判断要你自己补上"截至某年"的标签；读完你不会拿到 MVP、单位经济、绩效评估这类可操作工具，而且它和得到课程是捆绑发行的。'
  },
  {
    title: '海底捞你学不会',
    orig: '',
    author: '黄铁鹰（北大光华管理学院兼职教授、前天图投资合伙人）',
    year: '2011',
    zh: '作者是黄铁鹰，不是肖知兴——肖知兴是本书的评论者，按他检索会找错人。中信 2011 平装（219 页）与 2015 第 2 版精装（282 页）两种。',
    stage: '10 人→50 人',
    level: 2,
    minutes: '约 360 分钟',
    grade: 'C 单案例',
    who: '10 人到 50 人、做劳动密集型或服务型生意（餐饮、零售、美业、线下服务）的创始人，想搞懂一线员工激励如何影响客户体验的人；做软件、内容、一人公司的不适合，还在验证阶段的你也还雇不到几个人。',
    value: '把授权额度写成一个数字——"他可以不用问我，直接送不超过 __ 元／免除不超过 __%"，没有数字的授权等于没授权；激励挂到客户能感知的那个动作上，当天结算、可视化；师徒制写成四行：谁带、带成什么样算合格、合格后升什么、带人的人拿什么。',
    risk: '作者本人的结论标题就叫"你学不会"，等于明示不可外推，可它在国内被当"方法论"卖：一家公司、一个行业、一个时段，没有对照组（同商圈其他火锅店的同等投入，书中未做系统比较）；"把人当人对待"这类口号不可测量、无法证伪；模式还依赖高强度劳动和封闭式集体生活，这部分伦理与可持续代价书里几乎没讨论，上市后的公开信息也显示服务质量会被规模扩张稀释。'
  }
]
</script>

<template>
  <div class="sb-book-shelf sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Book Shelf · 12 本，按阶段排</span>
      <p class="sb-widget-sub">别的书架只告诉你读哪本，这里还写清楚：这本读完最容易歪成什么。</p>
    </div>

    <div class="sb-book-shelf-legend">
      <span class="sb-book-shelf-lg">
        <em>难度</em>
        <i class="is-lv-12"></i>1–2 一两天能啃
        <i class="is-lv-3"></i>3 要坐下来读
        <i class="is-lv-45"></i>4–5 要连着读几晚
      </span>
      <span class="sb-book-shelf-lg"><em>时长</em>按页数与体量估算，听书版本未核实</span>
      <span class="sb-book-shelf-lg"><em>证据</em>A 有研究设计 · B 一手实践 · C 多为自述或单案例</span>
    </div>

    <figure class="sb-book-shelf-fig">
      <ol class="sb-book-shelf-grid">
        <li v-for="(b, i) in BOOKS" :key="b.title" class="sb-book-shelf-card">
          <div class="sb-book-shelf-head">
            <span class="sb-book-shelf-no">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="sb-book-shelf-title">《{{ b.title }}》</span>
            <span v-if="b.orig" class="sb-book-shelf-orig">{{ b.orig }}</span>
            <span class="sb-book-shelf-stage">{{ b.stage }}</span>
            <span v-if="b.tag" class="sb-book-shelf-tag">{{ b.tag }}</span>
          </div>

          <div class="sb-book-shelf-meta">
            <span class="sb-book-shelf-chip">
              <span class="sb-book-shelf-k">作者</span>
              <span class="sb-book-shelf-v">{{ b.author }}</span>
            </span>
            <span class="sb-book-shelf-chip">
              <span class="sb-book-shelf-k">原版</span>
              <span class="sb-book-shelf-v">{{ b.year }}</span>
            </span>
            <span class="sb-book-shelf-chip">
              <span class="sb-book-shelf-k">时长</span>
              <span class="sb-book-shelf-v">{{ b.minutes }}（估算）</span>
            </span>
            <span class="sb-book-shelf-chip">
              <span class="sb-book-shelf-k">难度</span>
              <span class="sb-book-shelf-v">
                <span class="sb-book-shelf-lv" :class="'is-lv-' + b.level" aria-hidden="true">
                  <i v-for="n in 5" :key="b.title + '-lv-' + n" :class="{ 'is-on': n <= b.level }"></i>
                </span>
                {{ b.level }}/5
              </span>
            </span>
            <span class="sb-book-shelf-chip">
              <span class="sb-book-shelf-k">证据</span>
              <span class="sb-book-shelf-v">{{ b.grade }}</span>
            </span>
          </div>

          <div class="sb-book-shelf-zh">
            <span class="sb-book-shelf-k">版本</span>
            <p class="sb-book-shelf-text">{{ b.zh }}</p>
          </div>

          <div class="sb-book-shelf-block is-who">
            <span class="sb-book-shelf-label">适合谁</span>
            <p class="sb-book-shelf-text">{{ b.who }}</p>
          </div>

          <div class="sb-book-shelf-block is-value">
            <span class="sb-book-shelf-label">真正值钱的地方</span>
            <p class="sb-book-shelf-text">{{ b.value }}</p>
          </div>

          <div class="sb-book-shelf-block is-risk">
            <span class="sb-book-shelf-label">最容易被读歪成</span>
            <p class="sb-book-shelf-text">{{ b.risk }}</p>
          </div>
        </li>
      </ol>

      <span class="sr-only">
        本站书架共 12 本，按阶段排序：先解决有没有人愿意付钱，再解决怎么卖、怎么把动作交给第二个人，
        最后才是带团队。时长全部为估算。
        <template v-for="(b, i) in BOOKS" :key="b.title">
          第 {{ i + 1 }} 本，《{{ b.title }}》{{ b.orig ? '原名' + b.orig + '，' : '' }}{{ b.author }}，
          原版 {{ b.year }}，阶段 {{ b.stage }}，难度 {{ b.level }} 级，听读约 {{ b.minutes }}（估算），
          证据等级 {{ b.grade }}；
        </template>
        每本书卡上还有三行：适合谁、真正值钱的地方、最容易被读歪成什么。最后这行是本站比其他书架多写的一栏，
        12 条误读里反复出现的是同四类：把一个人的自述当成可复制的方法（《重来》《鞋狗》《详谈》
        《海底捞你学不会》），把访谈做完或画布填完当成验证完成（《The Mom Test》《精益创业实战》），
        把 2015 年美国渠道清单当成自己的获客地图（《Traction》），把术语扩成任意大变化（《创新者的窘境》
        里的"颠覆"、《精益创业》里的 MVP）。读完不等于会做。
      </span>
    </figure>

    <p class="sb-cap">
      这 12 本不是评分榜，是按阶段排的：<b>前 5 本</b>管"到底有没有人愿意付钱"，<b>中间 6 本</b>管
      "卖得动、也交接得出去"，<b>最后 1 本</b>留到你真要带人的那天再读。进榜门槛只有一条——
      <b>作者得给得出你今晚就能做完的动作</b>；查不到出处的、作者与书名对不上的、研究对象是几十年历史
      大公司的（《从0到1》《创业维艰》《跨越鸿沟》《从优秀到卓越》《基业长青》《原则》《这就是OKR》
      《奈飞文化手册》《指数级增长》），事实表里已经划出去了，这里一律不摆。每本最后那栏
      "容易被读歪成什么"是本站多写的一栏，因为 <b>读完不等于会做</b>：书给你一套说法，你的账本要的是
      一个动作——<b>挑一条做掉，比再买一本有用</b>。卡上的时长全按页数估，证据等级是本站按
      "结论有没有对照、能不能复核"给的字母，书目会随核对结果增删。
    </p>
  </div>
</template>

<style scoped>
.sb-book-shelf-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-bottom: 14px;
}

.sb-book-shelf-lg {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.07em;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-book-shelf-lg em {
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--muted);
}

/* 难度只按档位换 token 色，不引入新颜色，也不占用 coral（coral = 风险） */
.sb-book-shelf-lg i {
  width: 9px;
  height: 9px;
  margin-left: 6px;
  border-radius: 2px;
}

.sb-book-shelf-lg i.is-lv-12 {
  background: var(--accent);
}

.sb-book-shelf-lg i.is-lv-3 {
  background: var(--blue);
}

.sb-book-shelf-lg i.is-lv-45 {
  background: var(--lime);
}

.sb-book-shelf-fig {
  margin: 0;
}

.sb-book-shelf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-book-shelf-card {
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
  padding: 13px 14px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
}

.sb-book-shelf-card:hover {
  border-color: var(--line-strong);
  background: var(--panel-3);
}

.sb-book-shelf-head {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding-bottom: 9px;
  border-bottom: 1px dashed var(--line-strong);
}

.sb-book-shelf-no {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: var(--faint);
}

.sb-book-shelf-title {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-book-shelf-orig {
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-book-shelf-stage,
.sb-book-shelf-tag {
  justify-self: start;
  margin-top: 2px;
  padding: 2px 8px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-book-shelf-tag {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--accent);
}

.sb-book-shelf-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 4px 12px;
  min-width: 0;
}

.sb-book-shelf-chip {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.sb-book-shelf-k {
  flex: 0 0 auto;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-book-shelf-v {
  min-width: 0;
  overflow-wrap: anywhere;
}

.sb-book-shelf-lv {
  display: inline-flex;
  gap: 2px;
  margin-right: 5px;
  vertical-align: middle;
}

.sb-book-shelf-lv i {
  width: 7px;
  height: 9px;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
}

.sb-book-shelf-lv i.is-on {
  border-color: var(--accent);
  background: var(--accent);
}

.sb-book-shelf-lv.is-lv-3 i.is-on {
  border-color: var(--blue);
  background: var(--blue);
}

.sb-book-shelf-lv.is-lv-4 i.is-on,
.sb-book-shelf-lv.is-lv-5 i.is-on {
  border-color: var(--lime);
  background: var(--lime);
}

.sb-book-shelf-zh {
  display: grid;
  gap: 3px;
  min-width: 0;
  padding-top: 8px;
  border-top: 1px dashed var(--line);
}

.sb-book-shelf-zh .sb-book-shelf-text {
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--faint);
}

.sb-book-shelf-block {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.sb-book-shelf-label {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-book-shelf-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sb-book-shelf-block.is-who .sb-book-shelf-text {
  color: var(--muted);
}

.sb-book-shelf-block.is-value {
  padding-left: 10px;
  border-left: 1px solid var(--accent);
}

.sb-book-shelf-block.is-value .sb-book-shelf-label {
  color: var(--accent);
}

/* 风险位：coral 虚线框——这一栏是整张卡的落点 */
.sb-book-shelf-block.is-risk {
  padding: 9px 10px;
  border: 1px dashed var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
}

.sb-book-shelf-block.is-risk .sb-book-shelf-label {
  color: var(--coral);
}

@media (max-width: 760px) {
  .sb-book-shelf-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-book-shelf-card {
    padding: 12px;
  }

  /* 窄屏一行一条元信息：长英文作者名靠 anywhere 折行，不撑破栅格 */
  .sb-book-shelf-meta {
    grid-template-columns: minmax(0, 1fr);
  }

  .sb-book-shelf-legend {
    gap: 5px 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-book-shelf-card {
    transition: none;
  }
}
</style>
