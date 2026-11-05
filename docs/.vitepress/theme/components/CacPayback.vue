<script setup lang="ts">
// /run/acquisition · 获客花的钱什么时候回来。
// 纪律：图上每个数字都能在 .qoder 事实表里找到，并沿用事实表自己的分级
//   A 可核 / B 需限定 / C 流行说法 / X 本站自设情景（不是数据）。
// 事实表没给准数的东西（渠道饱和的具体百分比、中国转介绍成本、行业留存基准）
// 一律留白、标"示意"或标"情景"，不编数。
// 判断线（LTV ÷ CAC ≥ 3、回收期 ≤ 12 个月）出自 I-27（C 流行）与 I-17（B 需限定），
// 属投资人 / 从业者惯用阈值，不是经营铁律。

interface Row {
  label: string
  /** 条长用的值；null = 事实表没给数，只画空轨道 */
  value: number | null
  shown: string
  unit: string
  grade: 'A' | 'B' | 'C' | 'X'
  kind: 'cost' | 'rev' | 'keep' | 'time' | 'alt'
  note: string
}

/* ---------- 事实表里的输入（逐个标级） ---------- */
const P24_CAC_2024 = 35 // 元/人：餐饮公域获客，P-24，C 流行（区域媒体口径）
const P24_CAC_2026 = 67 // 元/人：同一口径 2026 上半年，P-24，C
const P24_BAND_LO = 80 // 元/人：火锅、烘焙 80–100，P-24，C
const P24_BAND_HI = 100
const P24_DROP = '30%–40%' // 2025 下半年同等投流预算效果同比差 30%–40%，P-24，C
const I28_SPEND = 2000 // 万元：示例投放额，I-28，C（举例，非行业数据）
const I28_ORDERS = 10 // 万单：示例成交，I-28，C
const EX_CAC = 200 // 元/单：2,000 万 ÷ 10 万单 = 200，I-28，C
const EX_PRICE = 100 // 元/月：示例客单价，I-28，C
const EX_MONTHS = 18 // 个月：示例平均付费期，I-28，C
const MARGIN = 55 // %：餐饮毛利率 55%–65% 的下沿，I-23，B 需限定（区间而非平均值）
const LINE_RATIO = 3 // 倍：LTV/CAC 业界惯例，I-27，C；I-17，B
const LINE_PAY = 12 // 月：CAC 回收期 <12 月为健康，I-27，C；I-17，B
const CAP_PAY = 18 // 月：18 月为常见容忍上限，I-27，C
const CHURN_LINE = 2 // %：SaaS 习惯线月流失 <2%，I-17，B 需限定（从业者阈值，非统计规律）
const RATIO_40_60 = '40%～60%' // 投放翻倍获客只增四到六成：component-spec 草稿标待核，事实表无准数

/* ---------- 纯算术换算（输入都在上面） ---------- */
const LTV_REV = EX_PRICE * EX_MONTHS // 1,800 元：营收口径
const MONTH_PROFIT = EX_PRICE * (MARGIN / 100) // 55 元/月：单个客户每月贡献毛利
const LTV_KEEP = LTV_REV * (MARGIN / 100) // 990 元：毛利口径
const RATIO_REV = LTV_REV / EX_CAC // 9.0 倍
const RATIO_KEEP = LTV_KEEP / EX_CAC // 4.95 倍
const PAY_EX = EX_CAC / MONTH_PROFIT // 3.6 个月
const CAC_W30 = EX_CAC / (1 - 0.3) // ≈286 元：效果差 30%
const CAC_W40 = EX_CAC / (1 - 0.4) // ≈333 元：效果差 40%
const PAY_W30 = CAC_W30 / MONTH_PROFIT // ≈5.2 个月
const PAY_W40 = CAC_W40 / MONTH_PROFIT // ≈6.1 个月
const CAC_STRETCH = P24_CAC_2026 / P24_CAC_2024 // ≈1.9 倍
const CHURN_IMPLIED = 100 / EX_MONTHS // ≈5.6%/月：18 个月寿命反推
const LIFE_AT_LINE = 100 / CHURN_LINE // 50 个月：按月流失 2% 口径
const LTV_AT_LINE = MONTH_PROFIT * LIFE_AT_LINE // 2,750 元
const RATIO_AT_LINE = LTV_AT_LINE / EX_CAC // ≈13.8 倍
const B2B_LIFE = 60 // 个月：本站情景，非数据
const PAY_B2B = B2B_LIFE / LINE_RATIO // 20 个月：3 倍线在这个寿命下等价于回收期 ≤20 月
const RATIO_B2B = B2B_LIFE / CAP_PAY // ≈3.3 倍：18 个月回收仍然通过 3 倍线

const f0 = (n: number) => String(Math.round(n))
const f1 = (n: number) => n.toFixed(1)
// 手写千分位：不用 toLocaleString，免得服务端与客户端的 ICU 配置给出两种字符串
const money = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+$)/g, ',')
const wOf = (v: number | null, max: number) =>
  v === null ? 0 : Math.min(+((v / max) * 100).toFixed(2), 100)

/* ---------- 刻度轴 ---------- */
const CAC_MAX = 200
const LTV_MAX = 1800
const RATIO_MAX = 9
const PAY_MAX = 24

const CAC_ROWS: Row[] = [
  {
    label: '餐饮公域投放 · 2024 年',
    value: P24_CAC_2024,
    shown: f0(P24_CAC_2024),
    unit: '元/人',
    grade: 'C',
    kind: 'cost',
    note: '区域媒体调查口径，不是平台公示；写进预算前要先定义"新客"还是"下单"'
  },
  {
    label: '餐饮公域投放 · 2026 上半年',
    value: P24_CAC_2026,
    shown: f0(P24_CAC_2026),
    unit: '元/人',
    grade: 'C',
    kind: 'cost',
    note: '同一个来源两年涨了约 ' + f1(CAC_STRETCH) + ' 倍（' + f0(P24_CAC_2026) + ' ÷ ' + f0(P24_CAC_2024) + '）'
  },
  {
    label: '火锅 / 烘焙 · 2026 上半年',
    value: P24_BAND_HI,
    shown: f0(P24_BAND_LO) + '–' + f0(P24_BAND_HI),
    unit: '元/人',
    grade: 'C',
    kind: 'cost',
    note: '条画到区间上沿；品类不同，别拿别人的数当自己的预算'
  },
  {
    label: '事实表教学示例 · 投放 ' + money(I28_SPEND) + ' 万换 ' + f0(I28_ORDERS) + ' 万单',
    value: EX_CAC,
    shown: f0(EX_CAC),
    unit: '元/单',
    grade: 'C',
    kind: 'cost',
    note: '举例、非行业数据；本图下面的回收期与倍率全部由它算出'
  },
  {
    label: '老客转介 / 内推',
    value: null,
    shown: '不印',
    unit: '没出处',
    grade: 'C',
    kind: 'alt',
    note: '事实表明确标注"内推 X 倍"一类数字未找到一手，本站不印；这条最便宜的渠道只能靠你自己的台账'
  }
]

const LTV_ROWS: Row[] = [
  {
    label: '营收口径 · 流水里经过你的手',
    value: LTV_REV,
    shown: money(LTV_REV),
    unit: '元',
    grade: 'C',
    kind: 'rev',
    note: f0(EX_PRICE) + ' 元/月 × 平均付费 ' + f0(EX_MONTHS) + ' 个月（事实表示例）——这不是你的钱'
  },
  {
    label: '毛利口径 · 真正留下的',
    value: LTV_KEEP,
    shown: money(LTV_KEEP),
    unit: '元',
    grade: 'B',
    kind: 'keep',
    note: f0(LTV_REV) + ' × 毛利率 ' + f0(MARGIN) + '%（行业毛利率区间下沿，区间非平均值）'
  }
]

const RATIO_ROWS: Row[] = [
  {
    label: '用营收口径算 LTV ÷ CAC',
    value: RATIO_REV,
    shown: f1(RATIO_REV),
    unit: '倍',
    grade: 'C',
    kind: 'rev',
    note: '同一批客户，换个分子就漂亮一倍；示例材料自己写的是 6 倍，按它给的 ' + money(LTV_REV) + ' 与 ' + f0(EX_CAC) + ' 除出来是 ' + f1(RATIO_REV)
  },
  {
    label: '用毛利口径算 LTV ÷ CAC',
    value: RATIO_KEEP,
    shown: f1(RATIO_KEEP),
    unit: '倍',
    grade: 'B',
    kind: 'keep',
    note: '本站建议口径：只算留下的毛利。两条都过 ' + f0(LINE_RATIO) + ' 倍线，但差距是 ' + f1(RATIO_REV) + ' 与 ' + f1(RATIO_KEEP)
  },
  {
    label: '把寿命改成月流失 ' + f0(CHURN_LINE) + '% 的口径（' + f0(LIFE_AT_LINE) + ' 个月）',
    value: RATIO_AT_LINE,
    shown: f1(RATIO_AT_LINE),
    unit: '倍',
    grade: 'B',
    kind: 'alt',
    note: 'LTV = ' + f0(MONTH_PROFIT) + ' × ' + f0(LIFE_AT_LINE) + ' = ' + money(LTV_AT_LINE) + ' 元。倍率超出 9 倍刻度，所以条画满；它一路涨靠的是寿命假设，回收期一个月都没动'
  }
]

const PAY_ROWS: Row[] = [
  {
    label: '示例生意 · ' + f0(EX_CAC) + ' ÷ ' + f0(MONTH_PROFIT) + ' 元/月',
    value: PAY_EX,
    shown: f1(PAY_EX),
    unit: '个月',
    grade: 'C',
    kind: 'time',
    note: '输入是事实表示例与毛利率下沿；换成你自己的两个数才有意义'
  },
  {
    label: '效果变差 ' + f0(30) + '% 后 · CAC ≈ ' + f0(CAC_W30),
    value: PAY_W30,
    shown: f1(PAY_W30),
    unit: '个月',
    grade: 'C',
    kind: 'cost',
    note: '「同等投流预算效果同比差 ' + P24_DROP + '」取自 P-24（C）；这里取区间两端各算一次'
  },
  {
    label: '效果变差 ' + f0(40) + '% 后 · CAC ≈ ' + f0(CAC_W40),
    value: PAY_W40,
    shown: f1(PAY_W40),
    unit: '个月',
    grade: 'C',
    kind: 'cost',
    note: '钱还是那么多钱，客户回来的速度慢了一截——先看见的是现金，不是利润'
  },
  {
    label: '情景：客户留 ' + f0(B2B_LIFE) + ' 个月的生意',
    value: PAY_B2B,
    shown: f0(PAY_B2B),
    unit: '个月',
    grade: 'X',
    kind: 'alt',
    note: '本站自设情景、不是任何统计值：把「≥' + f0(LINE_RATIO) + ' 倍」这条线翻译过来，就是回收期 ≤ ' + f0(PAY_B2B) + ' 个月'
  }
]

const GRADE_LEGEND = [
  { g: 'A', t: '可核' },
  { g: 'B', t: '需限定' },
  { g: 'C', t: '流行说法 / 示例' },
  { g: 'X', t: '本站情景，非数据' }
]

// 恒等式的三组翻译：倍率 ＝ 留存月数 ÷ 回收期 →「≥3 倍」在不同寿命下就是「回收期 ≤ 寿命÷3」
const IDENTITY = [
  { life: 6, pay: 6 / LINE_RATIO, scene: false },
  { life: EX_MONTHS, pay: EX_MONTHS / LINE_RATIO, scene: false },
  { life: B2B_LIFE, pay: PAY_B2B, scene: true }
]

/* ---------- 判断线尺子 SVG：viewBox 340 × 132 ----------
   绘图区 x 64 → 322（右端留 18），上文字基线最低 y=32、刻度最高 y=118（下留 14） */
const RX0 = 64
const RX1 = 322
const RSPAN = RX1 - RX0 // 258
const ROW_A_Y = 46 // 回收期尺
const ROW_B_Y = 104 // 倍率尺
const xPay = (m: number) => +(RX0 + (m / PAY_MAX) * RSPAN).toFixed(1)
const xRatio = (r: number) => +(RX0 + (r / RATIO_MAX) * RSPAN).toFixed(1)
// 端点代入校验：xPay(0)=64，xPay(3.636)=103，xPay(12)=193，xPay(18)=257.5，xPay(24)=322
//                xRatio(1)=92.7，xRatio(3)=150，xRatio(4.95)=205.9，xRatio(9)=322
const PAY_MARK_36 = xPay(PAY_EX)
const PAY_MARK_W40 = xPay(PAY_W40)
const RATIO_MARK_REV = xRatio(RATIO_REV)
const RATIO_MARK_KEEP = xRatio(RATIO_KEEP)
const RATIO_REF = xRatio(LINE_RATIO)
const PAY_REF_12 = xPay(LINE_PAY)
const PAY_REF_18 = xPay(CAP_PAY)

/* ---------- 渠道饱和示意 SVG：viewBox 340 × 192 ----------
   绘图区 x 48 → 322、y 26 → 150（基准 400 落在 26，100 落在 119） */
const SX0 = 48
const SX1 = 322
const SSX = SX1 - SX0 // 274
const SY_TOP = 26
const SY_BOT = 150
const SSY = SY_BOT - SY_TOP // 124
const SAT_MAX = 400 // 纵轴只看形状：不标任何百分比
const MULT = [1, 2, 3, 4]
const SAT_REF = [100, 200, 300, 400] // 等比例＝纯算术：钱几倍就当客户几倍
const SAT_SHAPE = [100, 165, 215, 250] // 只借「越加越钝」的形状，具体高度无一手来源，故不印数
const sX = (i: number) => +(SX0 + (i * SSX) / (MULT.length - 1)).toFixed(1)
const sY = (v: number) => +(SY_BOT - (v / SAT_MAX) * SSY).toFixed(1)
const sLine = (vals: number[]) => vals.map((v, i) => `${sX(i)},${sY(v)}`).join(' ')
const sArea = () =>
  sLine(SAT_SHAPE) +
  ' ' +
  [...SAT_REF].map((v, i) => `${sX(i)},${sY(v)}`).reverse().join(' ')
// 端点代入校验：sX(0)=48，sX(3)=322；sY(100)=119，sY(165)=98.8，sY(215)=83.3，
//              sY(250)=72.5，sY(400)=26 —— 全部落在 26…150 之间，无一点出界
</script>

<template>
  <div class="sb-cac-payback sb-widget" data-listen="skip">
    <span class="sr-only">
      这张图回答一个问题：获客花的钱什么时候回来。先说三个数的算法。CAC
      等于营销与销售的总花费除以新增付费客户；LTV 等于客单价乘以毛利率再乘以客户平均留下的月数，
      注意是毛利不是流水；回收期等于 CAC 除以每个客户每月贡献的毛利。
      获客成本这一栏，条形刻度 0 到 200 元：餐饮公域投放 2024 年约 35 元每人，
      2026 年上半年约 67 元每人（同一个来源两年涨了约 1.9 倍），火锅和烘焙约 80 到 100 元每人，
      事实表里的教学示例是投放 2,000 万元换来 10 万单、等于每单 200 元；
      老客转介与内推本站不给数字，因为事实表标注相关数据没有一手来源。
      前三项是区域媒体调查口径（C 流行说法），第四条是事实表里的教学示例（C，举例、非行业数据），
      第五条本站不印数：内推与转介绍相关比例在事实表里被标为「未找到一手」。
      客户终身价值这一栏，刻度 0 到 1,800 元：营收口径 1,800 元，就是每月 100 元乘以平均付费
      18 个月；换成毛利口径是 990 元，也就是 1,800 乘以毛利率 55%
      （餐饮行业毛利率区间 55% 到 65% 的下沿，分级 B 需限定，是区间不是平均值）。
      LTV 除以 CAC 这一组，刻度 0 到 9 倍，判断线画在 3 倍：营收口径算出 9.0 倍，
      毛利口径算出 5.0 倍；如果把平均付费期改成按月流失 2% 的口径、也就是能留 50 个月，
      终身价值变成 2,750 元、倍率变成 13.8 倍。注意最后这一步只改了寿命假设，
      回收期一点没变。
      回收期这一栏，刻度 0 到 24 个月，判断线画在 12 个月、常见容忍上限画在 18 个月：
      示例生意 200 元除以每月 55 元毛利等于 3.6 个月；如果同等投放预算的效果同比差 30%，
      获客成本变成约 286 元、回收期 5.2 个月；效果差 40% 时获客成本约 333 元、回收期
      6.1 个月。最后一条是本站自设情景、不是数据：客户能留 60 个月的生意，
      按 3 倍线倒推可以接受回收期到 20 个月，反过来 18 个月回本的倍率是 3.3 倍。
      判断线本身要说清：LTV 除以 CAC 不低于 3、回收期不超过 12 个月，是投资人和从业者常用的
      经验阈值，分级是 C 流行说法与 B 需限定，没有任何研究验证过它们能预测公司存活；
      另外两个数：LTV 除以 CAC 大于 1 才谈得上增长条件，18 个月是常见的容忍上限。
      一条算术恒等式：倍率等于客户平均留存月数除以回收期。所以两条线不是两条独立的规定，
      只是同一条线在不同寿命下的两种画法。
      下面的曲线是渠道饱和示意：横轴是同一渠道的投放预算倍数，从 1 倍到 4 倍，纵轴只看形状、
      不标百分比。虚线是等比例假设，也就是钱翻倍客户也该翻倍；实线是现实中常见的说法形状，
      越往上越钝，中间填色就是多花的钱买不到的那部分。流传的"投放翻倍、获客只增
      40% 到 60%"在事实表里没有找到一手来源，所以这条曲线只当形状看，不配具体百分比。
      同一份事实表里可引用的相邻数字是：2025 年下半年同等投流预算的效果同比差 30% 到
      40%（C 级），某电商服务行业调查中 78% 的商家把流量成本列为利润黑洞、63%
      的商家投流占营收 10% 以上（B 级需限定，样本是活跃商家、已退场的不在内）。
      最后一句：先算清回收期，再决定要不要加投放预算。
    </span>

    <div class="sb-widget-head">
      <span class="sb-widget-title">CAC · LTV · Payback · 获客花的钱什么时候回来</span>
      <p class="sb-widget-sub">
        三个数各自怎么算、什么时候敢加钱。判断线是别人常用的，不是经营铁律；事实表没给准数的地方，这张图直接留白。
      </p>
    </div>

    <div class="sb-cac-payback-defs">
      <div class="sb-cac-payback-def">
        <p class="sb-cac-payback-def-name">CAC · 获客成本</p>
        <p class="sb-cac-payback-def-formula">营销与销售总花费 ÷ 新增付费客户</p>
        <p class="sb-cac-payback-def-text">把这个客户「买回来」花了多少钱。销售的时间、样品、首单优惠都算，别只算广告费。</p>
      </div>
      <div class="sb-cac-payback-def">
        <p class="sb-cac-payback-def-name">LTV · 客户终身价值</p>
        <p class="sb-cac-payback-def-formula">客单 × 毛利率 × 平均留下月数</p>
        <p class="sb-cac-payback-def-text">这个客户一辈子给你留下的<b>毛利</b>，不是从他身上过的流水。两个数经常被当成一个。</p>
      </div>
      <div class="sb-cac-payback-def">
        <p class="sb-cac-payback-def-name">回收期 · 月</p>
        <p class="sb-cac-payback-def-formula">CAC ÷ 每客户每月贡献毛利</p>
        <p class="sb-cac-payback-def-text">几个月把这笔获客钱赚回来。它是现金流问题，比利润率更早决定你敢不敢花下一笔。</p>
      </div>
    </div>

    <p class="sb-cac-payback-keys" aria-hidden="true">
      <span v-for="k in GRADE_LEGEND" :key="k.g" class="sb-cac-payback-key">
        <i :class="'is-g' + k.g">{{ k.g }}</i>{{ k.t }}
      </span>
      <span class="sb-cac-payback-key is-hint">事实表没给准数的，本站不编</span>
    </p>

    <div class="sb-cac-payback-board">
      <section class="sb-cac-payback-col">
        <p class="sb-cac-payback-colhead">
          <span>CAC · 获客成本</span>
          <em class="sb-cac-payback-axis-unit">刻度 0–{{ CAC_MAX }} 元</em>
        </p>
        <div v-for="r in CAC_ROWS" :key="r.label" class="sb-cac-payback-item">
          <p class="sb-cac-payback-meta">
            <span class="sb-cac-payback-name">{{ r.label }}</span>
            <i class="sb-cac-payback-g" :class="'is-g' + r.grade">{{ r.grade }}</i>
          </p>
          <div class="sb-cac-payback-plot">
            <span class="sb-cac-payback-track">
              <span
                class="sb-cac-payback-fill"
                :class="'is-' + r.kind"
                :style="{ width: wOf(r.value, CAC_MAX) + '%' }"
              ></span>
            </span>
            <span class="sb-cac-payback-val" :class="r.kind === 'cost' ? 'is-coral' : 'is-ink'">
              {{ r.shown }}<em>{{ r.unit }}</em>
            </span>
          </div>
          <p class="sb-cac-payback-note">{{ r.note }}</p>
        </div>
      </section>

      <section class="sb-cac-payback-col">
        <p class="sb-cac-payback-colhead">
          <span>LTV · 留下的毛利</span>
          <em class="sb-cac-payback-axis-unit">刻度 0–{{ money(LTV_MAX) }} 元</em>
        </p>
        <div v-for="r in LTV_ROWS" :key="r.label" class="sb-cac-payback-item">
          <p class="sb-cac-payback-meta">
            <span class="sb-cac-payback-name">{{ r.label }}</span>
            <i class="sb-cac-payback-g" :class="'is-g' + r.grade">{{ r.grade }}</i>
          </p>
          <div class="sb-cac-payback-plot">
            <span class="sb-cac-payback-track">
              <span
                class="sb-cac-payback-fill"
                :class="'is-' + r.kind"
                :style="{ width: wOf(r.value, LTV_MAX) + '%' }"
              ></span>
            </span>
            <span class="sb-cac-payback-val" :class="r.kind === 'keep' ? 'is-teal' : 'is-ink'">
              {{ r.shown }}<em>{{ r.unit }}</em>
            </span>
          </div>
          <p class="sb-cac-payback-note">{{ r.note }}</p>
        </div>

        <p class="sb-cac-payback-subhead">LTV ÷ CAC · 刻度 0–{{ RATIO_MAX }} 倍，判断线画在 {{ f0(LINE_RATIO) }} 倍</p>
        <div v-for="r in RATIO_ROWS" :key="r.label" class="sb-cac-payback-item">
          <p class="sb-cac-payback-meta">
            <span class="sb-cac-payback-name">{{ r.label }}</span>
            <i class="sb-cac-payback-g" :class="'is-g' + r.grade">{{ r.grade }}</i>
          </p>
          <div class="sb-cac-payback-plot">
            <span class="sb-cac-payback-track">
              <span
                class="sb-cac-payback-fill"
                :class="'is-' + r.kind"
                :style="{ width: wOf(r.value, RATIO_MAX) + '%' }"
              ></span>
              <span class="sb-cac-payback-ref" :style="{ left: wOf(LINE_RATIO, RATIO_MAX) + '%' }"></span>
            </span>
            <span class="sb-cac-payback-val is-teal">{{ r.shown }}<em>{{ r.unit }}</em></span>
          </div>
          <p class="sb-cac-payback-note">{{ r.note }}</p>
        </div>

        <p class="sb-cac-payback-lifetime">
          寿命这一项最容易动手脚：示例里的「平均付费 {{ f0(EX_MONTHS) }} 个月」相当于每月约
          {{ f1(CHURN_IMPLIED) }}% 的客户在走（100 ÷ {{ f0(EX_MONTHS) }}）。从业者惯用的健康线是月流失低于
          {{ f0(CHURN_LINE) }}%（B 需限定，SaaS 口径，非统计规律）——照那个口径能留约
          {{ f0(LIFE_AT_LINE) }} 个月，终身价值就从 {{ money(LTV_KEEP) }} 元变成
          {{ money(LTV_AT_LINE) }} 元。同一门生意，两种结论，差别只在你把寿命填了几。
        </p>
      </section>

      <section class="sb-cac-payback-col">
        <p class="sb-cac-payback-colhead">
          <span>回收期 · 月</span>
          <em class="sb-cac-payback-axis-unit">刻度 0–{{ PAY_MAX }} 个月</em>
        </p>
        <div v-for="r in PAY_ROWS" :key="r.label" class="sb-cac-payback-item">
          <p class="sb-cac-payback-meta">
            <span class="sb-cac-payback-name">{{ r.label }}</span>
            <i class="sb-cac-payback-g" :class="'is-g' + r.grade">{{ r.grade }}</i>
          </p>
          <div class="sb-cac-payback-plot">
            <span class="sb-cac-payback-track">
              <span
                class="sb-cac-payback-fill"
                :class="'is-' + r.kind"
                :style="{ width: wOf(r.value, PAY_MAX) + '%' }"
              ></span>
              <span class="sb-cac-payback-ref" :style="{ left: wOf(LINE_PAY, PAY_MAX) + '%' }"></span>
              <span class="sb-cac-payback-ref is-cap" :style="{ left: wOf(CAP_PAY, PAY_MAX) + '%' }"></span>
            </span>
            <span class="sb-cac-payback-val" :class="r.kind === 'cost' ? 'is-coral' : 'is-teal'">
              {{ r.shown }}<em>{{ r.unit }}</em>
            </span>
          </div>
          <p class="sb-cac-payback-note">{{ r.note }}</p>
        </div>
        <p class="sb-cac-payback-legendline" aria-hidden="true">
          <span><i class="is-ref"></i>虚线＝{{ f0(LINE_PAY) }} 个月经验线</span>
          <span><i class="is-cap"></i>点线＝{{ f0(CAP_PAY) }} 个月常见容忍上限</span>
        </p>
      </section>
    </div>

    <figure class="sb-cac-payback-ruler">
      <svg viewBox="0 0 340 132" role="img" aria-labelledby="sb-cac-payback-ruler-t">
        <title id="sb-cac-payback-ruler-t">
          两条判断线尺子：上排是回收期 0 到 24 个月，虚线在 12 个月、点线在 18
          个月，示例值约 3.6 个月、效果变差后约 6.1 个月；下排是 LTV 除以 CAC 的 0 到 9
          倍，虚线在 3 倍，营收口径算出 9 倍、毛利口径算出 5 倍
        </title>

        <text class="sb-cac-payback-rowlab" :x="6" :y="ROW_A_Y + 3">回收期·月</text>
        <rect
          class="sb-cac-payback-overzone"
          :x="PAY_REF_18"
          y="36"
          :width="RX1 - PAY_REF_18"
          height="20"
        />
        <line class="sb-cac-payback-axis" :x1="RX0" :y1="ROW_A_Y" :x2="RX1" :y2="ROW_A_Y" />
        <line class="sb-cac-payback-judge" :x1="PAY_REF_12" y1="30" :x2="PAY_REF_12" y2="56" />
        <line class="sb-cac-payback-judge is-cap" :x1="PAY_REF_18" y1="30" :x2="PAY_REF_18" y2="56" />
        <line class="sb-cac-payback-lead" :x1="PAY_MARK_36" y1="36" :x2="PAY_MARK_36" :y2="ROW_A_Y" />
        <circle class="sb-cac-payback-dot" :cx="PAY_MARK_36" :cy="ROW_A_Y" r="3.6" />
        <circle class="sb-cac-payback-dot is-cost" :cx="PAY_MARK_W40" :cy="ROW_A_Y" r="3.6" />
        <text class="sb-cac-payback-note-t" :x="PAY_MARK_36 + 5" y="32">示例 {{ f1(PAY_EX) }} 个月</text>
        <text class="sb-cac-payback-tick" :x="RX0" :y="60">0</text>
        <text class="sb-cac-payback-tick is-ref" :x="PAY_REF_12" :y="60">{{ f0(LINE_PAY) }}</text>
        <text class="sb-cac-payback-tick is-cap" :x="PAY_REF_18" :y="60">{{ f0(CAP_PAY) }}</text>
        <text class="sb-cac-payback-tick" :x="RX1" :y="60" text-anchor="end">{{ PAY_MAX }}</text>

        <text class="sb-cac-payback-rowlab" :x="6" :y="ROW_B_Y + 3">LTV÷CAC</text>
        <line class="sb-cac-payback-axis" :x1="RX0" :y1="ROW_B_Y" :x2="RX1" :y2="ROW_B_Y" />
        <line class="sb-cac-payback-judge" :x1="RATIO_REF" y1="92" :x2="RATIO_REF" y2="114" />
        <circle class="sb-cac-payback-dot is-rev" :cx="RATIO_MARK_REV" :cy="ROW_B_Y" r="3.6" />
        <circle class="sb-cac-payback-dot" :cx="RATIO_MARK_KEEP" :cy="ROW_B_Y" r="3.6" />
        <text class="sb-cac-payback-note-t" :x="RATIO_MARK_REV - 6" :y="84" text-anchor="end">
          营收口径 {{ f1(RATIO_REV) }} 倍
        </text>
        <text class="sb-cac-payback-note-t" :x="RATIO_MARK_KEEP - 5" :y="84" text-anchor="end">
          毛利口径 {{ f1(RATIO_KEEP) }} 倍
        </text>
        <text class="sb-cac-payback-tick" :x="RX0" :y="118">0</text>
        <text class="sb-cac-payback-tick" :x="xRatio(1)" :y="118">1</text>
        <text class="sb-cac-payback-tick is-ref" :x="RATIO_REF" :y="118">{{ f0(LINE_RATIO) }}</text>
        <text class="sb-cac-payback-tick" :x="RX1" :y="118" text-anchor="end">{{ RATIO_MAX }}</text>
      </svg>
      <figcaption class="sb-cac-payback-cap-t">
        同一件事的两把尺子。上排把时间当刻度，下排把倍率当刻度——示例生意在下排看着很舒服（毛利口径
        {{ f1(RATIO_KEEP) }} 倍），到了上排只是一个 {{ f1(PAY_EX) }} 个月的点；而「效果变差
        {{ f0(40) }}%」这种变化，在下排几乎看不出来，在上排立刻把点往右推。
      </figcaption>
    </figure>

    <section class="sb-cac-payback-lines">
      <p class="sb-cac-payback-lines-title">两条判断线的真实身份：别人常用的线，不是经营铁律</p>
      <ul class="sb-cac-payback-facts">
        <li>
          <b>LTV ÷ CAC ≥ {{ f0(LINE_RATIO) }}</b>：出自从业者基准（I-27，C 流行；I-17，B
          需限定）。「找不到一手研究」「没有论文验证过这些阈值能预测存活」。同一份材料还说
          <b>&gt;{{ f0(1) }}</b> 才具备增长条件——先把这个更低的门槛守住。
        </li>
        <li>
          <b>回收期 ≤ {{ f0(LINE_PAY) }} 个月</b>：同为从业者惯用值（C／B）；<b>{{ f0(CAP_PAY) }}
          个月</b> 是常见容忍上限。它不是法律，也不是投资人的恩赐，只是他们看多了案子之后懒得重算的口诀。
        </li>
        <li>
          <b>一条算术恒等式</b>：倍率 ＝ 客户平均留存月数 ÷ 回收期。所以这两条线其实是一条线，
          寿命一换它就搬家——「留存期」是 LTV 的隐藏假设，同一家公司可以用不同口径「证明」任何结论。
        </li>
      </ul>
      <p class="sb-cac-payback-identity">
        <span v-for="it in IDENTITY" :key="it.life" class="sb-cac-payback-idg">
          客户留 <b :class="it.scene ? 'is-x' : ''">{{ f0(it.life) }} 个月</b> →
          {{ f0(LINE_RATIO) }} 倍线＝回收期 ≤
          <b :class="it.scene ? 'is-x' : ''">{{ f0(it.pay) }} 个月</b>
        </span>
      </p>
      <p class="sb-cac-payback-still">
        <b>什么生意天生不满足这两条线，也照样能活？</b>
        客单高、决策周期长的 B2B 最典型：一单签下来管几年，钱要先把人招齐、把交付做完、走完客户内部流程才回得来，
        回收期 {{ f0(CAP_PAY) }} 个月时倍率仍有 {{ f1(RATIO_B2B) }} 倍（情景算术，
        {{ f0(B2B_LIFE) }} ÷ {{ f0(CAP_PAY) }}）。照 {{ f0(LINE_PAY) }} 个月那条线判它「不健康」，
        纯属尺子拿错了。反过来，社区里靠老客复购的小店，回收期常常短到不用算，但 LTV
        也小，倍率照样难看——两句话：判断线用来提醒自己别失速，不用来给自己发奖状。
      </p>
      <p class="sb-cac-payback-still is-warn">
        另外，「回本周期 12–18 个月」这句话在招商话术里也常见（P-37，C
        流行：自报经营数据、无审计、以软文形式发布）。同样是「12–18
        个月」，一个是别人看案子的口诀，一个是让你掏钱的广告词，别混。
      </p>
    </section>

    <figure class="sb-cac-payback-sat">
      <p class="sb-cac-payback-sub">渠道饱和 · 示意曲线（形状来自通行说法，具体百分比事实表没有准数）</p>
      <svg viewBox="0 0 340 192" role="img" aria-labelledby="sb-cac-payback-sat-t">
        <title id="sb-cac-payback-sat-t">
          渠道饱和示意：横轴是同一渠道的投放预算倍数，从 1 倍到 4 倍；虚线是等比例假设（钱几倍就当客户几倍），
          实线是越加钱越钝的实际形状，中间填色是加钱买不到的部分；纵轴不标百分比，因为没有一手来源
        </title>

        <line class="sb-cac-payback-gridline" :x1="SX0" :y1="sY(100)" :x2="SX1" :y2="sY(100)" />
        <line class="sb-cac-payback-axis" :x1="SX0" :y1="SY_BOT" :x2="SX1" :y2="SY_BOT" />
        <line class="sb-cac-payback-axis" :x1="SX0" :y1="SY_TOP" :x2="SX0" :y2="SY_BOT" />

        <polygon class="sb-cac-payback-gap" :points="sArea()" />
        <polyline class="sb-cac-payback-refline" :points="sLine(SAT_REF)" />
        <polyline class="sb-cac-payback-shapeline" :points="sLine(SAT_SHAPE)" />
        <circle
          v-for="(v, i) in SAT_SHAPE"
          :key="'sd-' + i"
          class="sb-cac-payback-shapedot"
          :cx="sX(i)"
          :cy="sY(v)"
          r="3.2"
        />

        <text class="sb-cac-payback-tick" :x="SX0 - 5" :y="sY(100) + 3" text-anchor="end">基准</text>
        <text
          v-for="(m, i) in MULT"
          :key="'sx-' + i"
          class="sb-cac-payback-tick"
          :x="sX(i)"
          y="163"
          text-anchor="middle"
        >
          {{ m }}×
        </text>
        <text class="sb-cac-payback-note-t" x="320" :y="SY_TOP - 6" text-anchor="end">等比例（假设）</text>
        <text class="sb-cac-payback-note-t" x="318" :y="sY(250) - 8" text-anchor="end">实际（示意）</text>
        <text class="sb-cac-payback-axislab" x="185" y="181" text-anchor="middle">
          同一渠道的投放预算倍数 →
        </text>
      </svg>
      <figcaption class="sb-cac-payback-cap-t">
        虚线是算术：钱翻倍就当客户翻倍。实线是很多人实际遇到的形状：越加越钝，中间的填色就是加钱买不到的那部分。
        流传的「投放翻倍、获客只增 {{ RATIO_40_60 }}」在事实表里没找到一手来源（规范草稿标「待核」），
        所以这条曲线<b>只给形状、不给百分比</b>。相邻可引用的两个数是：同等投流预算的效果，
        2025 年下半年同比差 {{ P24_DROP }}（P-24，C）；某电商服务行业调查中 {{ f0(78) }}%
        的商家把流量成本列为利润黑洞、{{ f0(63) }}% 投流占营收 {{ f0(10) }}% 以上（P-23，B
        需限定，样本是还在场的商家）。
      </figcaption>
    </figure>

    <p class="sb-cap">
      一条链子从头算到尾：示例里投放 <b>2,000 万</b>换 <b>10 万单</b>，也就是
      <b>CAC 200 元</b>；客户每月 <b>100 元</b>、按毛利率 <b>55%</b> 算，每月给你留下
      <b>55 元</b>，于是回收期是 <b>3.6 个月</b>、毛利口径 LTV 是 <b>990 元</b>、倍率
      <b>5.0 倍</b>（同一条链子用流水当分子会算成 <b>9.0 倍</b>）。同一份事实表说餐饮公域获客从
      <b>35 元/人</b>（2024）涨到 <b>67 元/人</b>（2026 上半年），火锅烘焙
      <b>80–100 元</b>，而同等预算的效果一年里同比差 <b>30%–40%</b>——把它代回回收期，
      <b>3.6 个月</b> 就变成 <b>5.2 到 6.1 个月</b>。至于 <b>LTV ÷ CAC ≥ 3</b>、
      <b>回收期 ≤ 12 个月</b>，那是投资人懒得重算的口诀（C／B 级，没被研究验证过）：客户能留
      <b>60 个月</b>的生意，按 3 倍线倒推回收期可以松到 <b>20 个月</b>，硬套 12
      个月只会把 B2B 判成「不健康」。而回收期之所以比倍率诚实，是因为它把时间算进来了——你把寿命假设从
      <b>18 个月</b> 改成 <b>50 个月</b>，倍率能从 <b>5.0</b> 一路涨到
      <b>13.8</b>，回收期一动不动，可你的钱还是那笔钱。所以顺序别反：<b>先算清回收期，再决定要不要加投放预算</b>；
      以及，获客成本那一列里最后那条<b>空着的「老客转介 / 内推」</b>不是漏画，是本站不给没出处的数——那个数只有你自己的台账知道。
    </p>
  </div>
</template>

<style scoped>
.sb-cac-payback-defs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sb-cac-payback-def {
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-cac-payback-def-name {
  margin: 0 0 5px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.sb-cac-payback-def-formula {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.45;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-cac-payback-def-text {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-cac-payback-keys {
  display: flex;
  flex-wrap: wrap;
  gap: 5px 14px;
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-cac-payback-key {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sb-cac-payback-key i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 13px;
  height: 13px;
  border: 1px solid var(--line-strong);
  border-radius: 3px;
  font-style: normal;
  font-size: 8.5px;
  font-weight: 700;
  color: var(--ink-2);
}

.sb-cac-payback-key i.is-gB {
  border-color: var(--blue);
  color: var(--blue);
}

.sb-cac-payback-key i.is-gC {
  border-color: var(--coral);
  color: var(--coral);
}

.sb-cac-payback-key.is-hint {
  color: var(--muted);
}

.sb-cac-payback-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 14px;
}

.sb-cac-payback-col {
  min-width: 0;
  padding-top: 10px;
  border-top: 2px solid var(--line-strong);
}

.sb-cac-payback-colhead {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 3px 8px;
  margin: 0 0 10px;
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}

.sb-cac-payback-axis-unit,
.sb-cac-payback-subhead {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-cac-payback-subhead {
  display: block;
  margin: 14px 0 8px;
  padding-top: 8px;
  border-top: 1px dashed var(--line-strong);
}

.sb-cac-payback-item {
  margin-bottom: 11px;
  min-width: 0;
}

.sb-cac-payback-meta {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 0 0 4px;
}

.sb-cac-payback-name {
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sb-cac-payback-g {
  flex: none;
  width: 13px;
  height: 13px;
  border: 1px solid var(--line-strong);
  border-radius: 3px;
  font-family: var(--font-mono);
  font-style: normal;
  font-size: 8.5px;
  font-weight: 700;
  line-height: 13px;
  text-align: center;
  color: var(--ink-2);
}

.sb-cac-payback-g.is-gB {
  border-color: var(--blue);
  color: var(--blue);
}

.sb-cac-payback-g.is-gC {
  border-color: var(--coral);
  color: var(--coral);
}

.sb-cac-payback-g.is-gX {
  border-style: dashed;
  color: var(--muted);
}

/* 条与数值各占一格：width:xx% 永远只对着轨道算，窄屏才不溢出 */
.sb-cac-payback-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 8px;
}

.sb-cac-payback-track {
  position: relative;
  display: block;
  min-width: 0;
  height: 13px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-cac-payback-fill {
  position: absolute;
  top: 1px;
  bottom: 1px;
  left: 1px;
  min-width: 0;
  border-radius: 4px;
  transition: width 0.3s var(--ease);
}

.sb-cac-payback-fill.is-cost {
  background: var(--coral);
  opacity: 0.8;
}

.sb-cac-payback-fill.is-rev {
  background: var(--blue);
  opacity: 0.45;
}

.sb-cac-payback-fill.is-keep,
.sb-cac-payback-fill.is-time {
  background: var(--accent);
  opacity: 0.85;
}

.sb-cac-payback-fill.is-alt {
  background: var(--lime);
  opacity: 0.6;
}

.sb-cac-payback-ref {
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 0;
  border-left: 1px dashed var(--coral);
}

.sb-cac-payback-ref.is-cap {
  border-left-style: dotted;
  opacity: 0.7;
}

.sb-cac-payback-val {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;
}

.sb-cac-payback-val em {
  font-size: 8.5px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-cac-payback-val.is-coral {
  color: var(--coral);
}

.sb-cac-payback-val.is-teal {
  color: var(--accent);
}

.sb-cac-payback-val.is-ink {
  color: var(--ink-2);
}

.sb-cac-payback-note {
  margin: 5px 0 0;
  font-size: 10.5px;
  line-height: 1.55;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-cac-payback-lifetime {
  margin: 12px 0 0;
  padding: 9px 10px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  font-size: 10.5px;
  line-height: 1.6;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-cac-payback-legendline {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 10px 0 0;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-cac-payback-legendline span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sb-cac-payback-legendline i {
  width: 0;
  height: 11px;
  border-left: 1px dashed var(--coral);
}

.sb-cac-payback-legendline i.is-cap {
  border-left-style: dotted;
}

/* ---------- 判断线尺子 ---------- */
.sb-cac-payback-ruler,
.sb-cac-payback-sat {
  margin: 16px 0 0;
  padding: 13px 14px 11px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--panel);
}

.sb-cac-payback-ruler svg,
.sb-cac-payback-sat svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-cac-payback-rowlab,
.sb-cac-payback-tick,
.sb-cac-payback-note-t,
.sb-cac-payback-axislab {
  font-family: var(--font-mono);
  font-size: 8.5px;
  letter-spacing: 0.06em;
}

.sb-cac-payback-rowlab {
  fill: var(--muted);
  letter-spacing: 0.02em;
}

.sb-cac-payback-tick {
  fill: var(--faint);
}

.sb-cac-payback-tick.is-ref {
  fill: var(--coral);
  font-weight: 700;
}

.sb-cac-payback-tick.is-cap {
  fill: var(--coral);
  opacity: 0.75;
}

.sb-cac-payback-note-t {
  fill: var(--ink-2);
}

.sb-cac-payback-axislab {
  fill: var(--faint);
}

.sb-cac-payback-axis {
  stroke: var(--line-strong);
  stroke-width: 1;
}

.sb-cac-payback-gridline {
  stroke: var(--grid-line);
  stroke-width: 1;
  stroke-dasharray: 3 3;
}

.sb-cac-payback-judge {
  stroke: var(--coral);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
}

.sb-cac-payback-judge.is-cap {
  stroke-dasharray: 1.5 3;
  opacity: 0.8;
}

.sb-cac-payback-lead {
  stroke: var(--accent);
  stroke-width: 1;
  opacity: 0.5;
}

.sb-cac-payback-overzone {
  fill: var(--coral);
  opacity: 0.1;
}

.sb-cac-payback-dot {
  fill: var(--accent);
  stroke: var(--panel);
  stroke-width: 1.2;
}

.sb-cac-payback-dot.is-cost {
  fill: var(--coral);
}

.sb-cac-payback-dot.is-rev {
  fill: var(--blue);
}

.sb-cac-payback-gap {
  fill: var(--coral);
  opacity: 0.12;
}

.sb-cac-payback-refline {
  fill: none;
  stroke: var(--muted);
  stroke-width: 1.4;
  stroke-dasharray: 4 4;
}

.sb-cac-payback-shapeline {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.4;
  stroke-linecap: round;
}

.sb-cac-payback-shapedot {
  fill: var(--panel);
  stroke: var(--accent);
  stroke-width: 2;
}

.sb-cac-payback-sub {
  margin: 0 0 10px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.6;
  color: var(--faint);
}

.sb-cac-payback-cap-t {
  margin: 9px 0 0;
  font-size: 11px;
  line-height: 1.65;
  color: var(--muted);
  overflow-wrap: anywhere;
}

/* ---------- 判断线说明 ---------- */
.sb-cac-payback-lines {
  margin-top: 16px;
  padding: 13px 14px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--panel-2);
}

.sb-cac-payback-lines-title {
  margin: 0 0 9px;
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.sb-cac-payback-facts {
  display: grid;
  gap: 7px;
  margin: 0;
  padding: 0 0 0 16px;
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--muted);
}

.sb-cac-payback-facts b {
  color: var(--ink);
  font-weight: 680;
}

.sb-cac-payback-identity {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 3px 7px;
  margin: 12px 0 0;
  padding: 9px 10px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.02em;
  line-height: 1.6;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-cac-payback-identity b {
  color: var(--accent);
  font-weight: 700;
}

.sb-cac-payback-identity b.is-x {
  color: var(--muted);
  border-bottom: 1px dotted var(--line-strong);
}

.sb-cac-payback-idg {
  padding-right: 10px;
  border-right: 1px dashed var(--line-strong);
}

.sb-cac-payback-idg:last-child {
  padding-right: 0;
  border-right: none;
}

.sb-cac-payback-still {
  margin: 11px 0 0;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-cac-payback-still b {
  color: var(--ink);
  font-weight: 680;
}

.sb-cac-payback-still.is-warn {
  padding: 9px 11px;
  border-left: 3px solid var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
  color: var(--ink-2);
}

@media (max-width: 760px) {
  .sb-cac-payback-defs,
  .sb-cac-payback-board {
    grid-template-columns: minmax(0, 1fr);
  }

  /* 次要图例可藏，数字与结论一律留在栏内（sr-only 另有一份完整朗读） */
  .sb-cac-payback-keys {
    display: none;
  }

  .sb-cac-payback-col {
    padding-bottom: 4px;
  }

  .sb-cac-payback-plot {
    grid-template-columns: minmax(0, 1fr) 58px;
    gap: 7px;
  }

  .sb-cac-payback-track {
    height: 15px;
  }

  .sb-cac-payback-name {
    font-size: 12px;
  }

  .sb-cac-payback-note {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-cac-payback-fill {
    transition: none;
  }
}
</style>
