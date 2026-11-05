<script setup lang="ts">
// /ready/money 的跑道桶：三种进场方式，各自能撑几个月。
// 公式只有一个：可亏资金 ÷ 月燃烧率 = 可撑月数。数值为示意口径（待核）。

interface Bucket {
  key: string
  name: string
  sub: string
  /** 确定亏得起的钱（万元），不含房租、学费这些必须花的 */
  money: number
  /** 每月燃烧率（万元） */
  burn: number
  kind: 'self' | 'outside'
  note: string
}

const BUCKETS: Bucket[] = [
  {
    key: 'allin',
    name: 'all-in 辞职做',
    sub: '没有工资兜底，生活开销也一起烧',
    money: 18,
    burn: 3,
    kind: 'self',
    note: '辞职那天起，房租、房贷、家里的固定支出都算进燃烧率，别只算公司那一半。'
  },
  {
    key: 'side',
    name: '下班做副业',
    sub: '工资还在进账，只投下班时间和小钱',
    money: 6,
    burn: 1,
    kind: 'self',
    note: '燃烧率低是因为支出被工资挡住了，不是因为生意便宜；代价是慢。'
  },
  {
    key: 'outside',
    name: '拿别人的钱做',
    sub: '账面钱最多，但里程碑也在烧你',
    money: 60,
    burn: 8,
    kind: 'outside',
    note: '外部资金买来的是速度和约束：人先招齐、办公室先变大，燃烧率跟着上台阶。'
  }
]

const AXIS_MAX = 24
const REF_MONTHS = 18

const monthsOf = (b: Bucket) => b.money / b.burn
const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
/** 条宽封顶在 100%，超出右界的月份由数字自己说明，不让条撑破轨道 */
const widthOf = (b: Bucket) => Math.min((monthsOf(b) / AXIS_MAX) * 100, 100)
const REF_POS = (REF_MONTHS / AXIS_MAX) * 100

const KIND_LABEL: Record<Bucket['kind'], string> = {
  self: '自己出钱',
  side: '自己出钱',
  outside: '外部资金'
}
</script>

<template>
  <div class="sb-runway-bucket sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Runway · 你能撑几个月</span>
      <p class="sb-widget-sub">同一个公式套三档进场方式：可亏资金 ÷ 月燃烧率 = 还能活几个月。</p>
    </div>

    <figure class="sb-runway-bucket-fig">
      <div v-for="b in BUCKETS" :key="b.key" class="sb-runway-bucket-item">
        <div class="sb-runway-bucket-meta">
          <span class="sb-runway-bucket-name">{{ b.name }}</span>
          <span class="sb-runway-bucket-formula">
            可亏 {{ fmt(b.money) }} 万 ÷ 燃烧 {{ fmt(b.burn) }} 万/月
            <em>{{ KIND_LABEL[b.kind] }}</em>
          </span>
        </div>

        <div class="sb-runway-bucket-plot">
          <div class="sb-runway-bucket-track" :class="{ 'is-outside': b.kind === 'outside' }">
            <span
              class="sb-runway-bucket-bar"
              :style="{ width: widthOf(b) + '%' }"
            ></span>
            <span class="sb-runway-bucket-ref" :style="{ left: REF_POS + '%' }"></span>
          </div>
          <span class="sb-runway-bucket-months">
            {{ fmt(monthsOf(b)) }}<em>个月</em>
          </span>
        </div>

        <p class="sb-runway-bucket-note">{{ b.sub }}。{{ b.note }}</p>
      </div>

      <div class="sb-runway-bucket-axis">
        <div class="sb-runway-bucket-ticks" aria-hidden="true">
          <span class="sb-runway-bucket-tick" style="left: 0%">0</span>
          <span class="sb-runway-bucket-tick is-ref" :style="{ left: REF_POS + '%' }">
            {{ REF_MONTHS }} 个月
          </span>
          <span class="sb-runway-bucket-tick" style="left: 100%">{{ AXIS_MAX }}</span>
        </div>
        <span class="sb-runway-bucket-axis-unit">月</span>
      </div>

      <span class="sr-only">
        三档各一条横条，刻度从 0 到 {{ AXIS_MAX }} 个月，虚线在 {{ REF_MONTHS }}
        个月处。第一档「all-in 辞职做」：可亏资金 18 万，月燃烧率 3 万，可撑
        {{ fmt(monthsOf(BUCKETS[0])) }} 个月。第二档「下班做副业」：可亏资金 6 万，月燃烧率 1
        万，可撑 {{ fmt(monthsOf(BUCKETS[1])) }} 个月。第三档「拿别人的钱做」：可亏资金 60
        万，月燃烧率 8 万，可撑 {{ fmt(monthsOf(BUCKETS[2])) }} 个月。三档都没到 18
        个月这条线。上面这些是示意数字，你自己的账要用你实际的可亏资金和燃烧率重算。
      </span>
    </figure>

    <p class="sb-cap">
      三条跑道分别是 <b>6 个月</b>、<b>6 个月</b>、<b>7.5 个月</b>，全都没够到
      <b>18 个月</b> 那条线——那是投资人爱看的口径，不是你活命的口径。决定长短的是
      <b>燃烧率</b>，不是存款数：钱多但花得猛，跑道照样短。算之前先把房租和孩子的学费划出去，
      <b>那些钱不是启动资金</b>。
    </p>
  </div>
</template>

<style scoped>
.sb-runway-bucket-fig {
  margin: 0;
}

.sb-runway-bucket-item {
  margin-bottom: 14px;
}

.sb-runway-bucket-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-bottom: 5px;
}

.sb-runway-bucket-name {
  font-size: 13px;
  font-weight: 670;
  color: var(--ink);
}

.sb-runway-bucket-formula {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-runway-bucket-formula em {
  margin-left: 6px;
  padding: 1px 5px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  font-style: normal;
  font-size: 9px;
  color: var(--muted);
}

/* 条自己占一列，月数单独占一列：width:xx% 永远只对着轨道算 */
.sb-runway-bucket-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  align-items: center;
  gap: 10px;
}

.sb-runway-bucket-track {
  position: relative;
  min-width: 0;
  height: 26px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-runway-bucket-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-right: 1px solid var(--panel);
  background: var(--accent);
  opacity: 0.8;
  transition: width 0.3s var(--ease);
}

.sb-runway-bucket-track.is-outside .sb-runway-bucket-bar {
  background: var(--blue);
  opacity: 0.7;
}

.sb-runway-bucket-ref {
  position: absolute;
  top: -1px;
  bottom: -1px;
  width: 0;
  border-left: 1px dashed var(--coral);
}

.sb-runway-bucket-months {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-2);
  white-space: nowrap;
}

.sb-runway-bucket-months em {
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-runway-bucket-note {
  margin: 5px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-runway-bucket-axis {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 58px;
  gap: 10px;
  margin-top: 2px;
}

.sb-runway-bucket-ticks {
  position: relative;
  min-width: 0;
  height: 15px;
  border-top: 1px solid var(--line);
}

.sb-runway-bucket-tick {
  position: absolute;
  top: 3px;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--faint);
  white-space: nowrap;
}

.sb-runway-bucket-tick.is-ref {
  color: var(--coral);
}

.sb-runway-bucket-axis-unit {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--faint);
  text-align: right;
}

@media (max-width: 760px) {
  .sb-runway-bucket-plot,
  .sb-runway-bucket-axis {
    grid-template-columns: minmax(0, 1fr) 50px;
    gap: 8px;
  }

  .sb-runway-bucket-track {
    height: 30px;
  }

  /* 三个刻挤在一起就只留经验线，两端数字由正文补 */
  .sb-runway-bucket-tick {
    font-size: 9.5px;
  }

  .sb-runway-bucket-note {
    font-size: 11.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-runway-bucket-bar {
    transition: none;
  }
}
</style>
