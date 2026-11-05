<script setup lang="ts">
interface Step {
  label: string
  from: number
  to: number
  kind: 'start' | 'cut' | 'end'
  shown: string
  note: string
}

// 草稿口径（待核）：把收入当 100 个点，逐级往下扣；行业净利参考带也是常见量级，不是审计数。
const STEPS: Step[] = [
  {
    label: '收入',
    from: 0,
    to: 100,
    kind: 'start',
    shown: '100 个点',
    note: '进账 100，听着像全是你的。'
  },
  {
    label: '扣直接成本',
    from: 100,
    to: 58,
    kind: 'cut',
    shown: '−42，剩 58',
    note: '货、原料、包装、快递或师傅分成。这一刀最硬，也最容易被「进货便宜点」糊弄。'
  },
  {
    label: '扣房租与人力',
    from: 58,
    to: 32,
    kind: 'cut',
    shown: '−26，剩 32',
    note: '有没有单子它都每月照扣，还包括你自己那份「先不领工资」。'
  },
  {
    label: '扣营销与获客',
    from: 32,
    to: 20,
    kind: 'cut',
    shown: '−12，剩 20',
    note: '投流、平台抽成、老带新的红包。停止投放的那天，单子也跟着停。'
  },
  {
    label: '扣税费与管理',
    from: 20,
    to: 14,
    kind: 'cut',
    shown: '−6，剩 14',
    note: '附加税费、社保、代账与杂项。税率与征收口径以当地当年为准，这里是示意。'
  },
  {
    label: '净利',
    from: 0,
    to: 14,
    kind: 'end',
    shown: '14 个点',
    note: '最后能留下的那一点，才是用来冒险的钱。'
  }
]

interface Band {
  name: string
  min: number
  max: number
  shown: string
}

const BANDS: Band[] = [
  { name: '餐饮门店', min: 3, max: 10, shown: '约 3%–10%' },
  { name: '零售与电商', min: 2, max: 8, shown: '约 2%–8%' },
  { name: '生活服务', min: 8, max: 18, shown: '约 8%–18%' },
  { name: '软件与订阅', min: 10, max: 30, shown: '约 10%–30%' }
]

const AXIS_MAX = 30
const SAMPLE_NET = 14
const pctOf = (n: number) => (n / 100) * 100
const bandLeft = (v: number) => (v / AXIS_MAX) * 100
const bandWidth = (b: Band) => ((b.max - b.min) / AXIS_MAX) * 100
const markLeft = bandLeft(SAMPLE_NET)
const cutOpacity = (i: number) => [1, 0.82, 0.66, 0.5][Math.min(i, 3)]
</script>

<template>
  <div class="sb-margin-waterfall sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Margin Waterfall · 100 块最后剩几块</span>
      <p class="sb-widget-sub">把收入当成 100 个点，一级级往下扣，看看最后站在你口袋里的是几个点。</p>
    </div>

    <ol class="sb-margin-waterfall-steps">
      <li v-for="(s, i) in STEPS" :key="s.label" class="sb-margin-waterfall-item">
        <div class="sb-margin-waterfall-plot">
          <div class="sb-margin-waterfall-meta">
            <span class="sb-margin-waterfall-name">{{ s.label }}</span>
            <span class="sb-margin-waterfall-note">{{ s.note }}</span>
          </div>
          <div class="sb-margin-waterfall-track" :class="{ 'is-end': s.kind === 'end' }">
            <span
              v-if="s.kind === 'cut'"
              class="sb-margin-waterfall-keep"
              :style="{ width: pctOf(s.to) + '%' }"
              aria-hidden="true"
            ></span>
            <span
              v-if="s.kind === 'cut'"
              class="sb-margin-waterfall-cut"
              :style="{ left: pctOf(s.to) + '%', width: pctOf(s.from - s.to) + '%', opacity: cutOpacity(i - 1) }"
              aria-hidden="true"
            ></span>
            <span
              v-else
              class="sb-margin-waterfall-base"
              :style="{ width: pctOf(s.to) + '%' }"
              aria-hidden="true"
            ></span>
          </div>
          <span class="sb-margin-waterfall-val" :class="s.kind === 'cut' ? 'is-cut' : 'is-keep'">
            {{ s.shown }}
          </span>
        </div>
      </li>
    </ol>

    <p class="sb-margin-waterfall-legend" aria-hidden="true">
      <span><i class="is-keep"></i>留下来的钱</span>
      <span><i class="is-cut"></i>这一刀扣掉的</span>
      <span class="sb-margin-waterfall-unit">横条以收入 100 为满格</span>
    </p>

    <section class="sb-margin-waterfall-bands">
      <div class="sb-margin-waterfall-bandhead">
        <span>行业净利参考带（待核，示意）</span>
        <span class="sb-margin-waterfall-mark-info">虚线＝本页示例 {{ SAMPLE_NET }}%</span>
      </div>

      <div class="sb-margin-waterfall-bandrow">
        <div class="sb-margin-waterfall-bandscale">
          <span
            v-for="t in [0, 10, 20, 30]"
            :key="'t' + t"
            class="sb-margin-waterfall-scaletick"
            :class="{ 'is-first': t === 0, 'is-last': t === 30 }"
            :style="{ left: bandLeft(t) + '%' }"
            >{{ t }}%</span
          >
        </div>
        <span class="sb-margin-waterfall-bandlabel"><em>净利率刻度</em></span>
      </div>

      <div v-for="b in BANDS" :key="b.name" class="sb-margin-waterfall-bandrow">
        <div class="sb-margin-waterfall-bandtrack">
          <span
            class="sb-margin-waterfall-band"
            :style="{ left: bandLeft(b.min) + '%', width: bandWidth(b) + '%' }"
            aria-hidden="true"
          ></span>
          <span class="sb-margin-waterfall-mark" :style="{ left: markLeft + '%' }" aria-hidden="true"></span>
        </div>
        <span class="sb-margin-waterfall-bandlabel">
          <b>{{ b.name }}</b>
          <em>{{ b.shown }}</em>
        </span>
      </div>
    </section>

    <span class="sr-only">
      瀑布逐级扣减，把收入记作 100 个点，示意口径、待核：收入 100；扣直接成本
      42，剩 58，毛利率 58%；扣房租与人力 26，剩 32；扣营销与获客 12，剩
      20；扣税费与管理 6，剩 14；净利 14 个点，净利率 14%。
      也就是说毛利率 58% 和净利率 14% 是两个数，不是同一个。
      常见行业的净利参考带：餐饮门店约 3% 到 10%，零售与电商约 2% 到 8%，生活服务约
      8% 到 18%，软件与订阅约 10% 到 30%。税费与社保的实际口径以当地当年规定为准，这里是示意。
    </span>

    <p class="sb-cap">
      收入 <b>100 个点</b>，扣掉直接成本 <b>42</b>、房租人力 <b>26</b>、营销获客
      <b>12</b>、税费管理 <b>6</b>，净利只剩 <b>14 个点</b>。毛利率 <b>58%</b>
      和净利率 <b>14%</b> 是两个数，很多人把它们当一个——餐饮常见净利 <b>3%–10%</b>
      个点，一次退货潮或一次涨房租就能吃光（参考带为示意，税费以当地当年口径为准）。
    </p>
  </div>
</template>

<style scoped>
.sb-margin-waterfall-steps {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-margin-waterfall-item {
  min-width: 0;
}

.sb-margin-waterfall-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 108px;
  align-items: center;
  column-gap: 12px;
  row-gap: 4px;
}

.sb-margin-waterfall-meta {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.sb-margin-waterfall-name {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-margin-waterfall-note {
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
}

.sb-margin-waterfall-track {
  grid-column: 1;
  grid-row: 2;
  position: relative;
  min-width: 0;
  height: 22px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-margin-waterfall-track.is-end {
  border-color: var(--accent);
}

.sb-margin-waterfall-base {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  min-width: 4px;
  border-radius: 5px;
  background: var(--accent);
  opacity: 0.85;
  transition: width 0.35s var(--ease);
}

.sb-margin-waterfall-keep {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  border-radius: 5px 0 0 5px;
  background: var(--accent);
  opacity: 0.24;
  transition: width 0.35s var(--ease);
}

.sb-margin-waterfall-cut {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border-left: 1px solid var(--coral);
  background: var(--coral);
  transition: width 0.35s var(--ease), left 0.35s var(--ease);
}

.sb-margin-waterfall-val {
  grid-column: 2;
  grid-row: 1 / span 2;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-align: right;
  white-space: nowrap;
}

.sb-margin-waterfall-val.is-cut {
  color: var(--coral);
}

.sb-margin-waterfall-val.is-keep {
  color: var(--accent);
  font-weight: 700;
}

.sb-margin-waterfall-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 16px 0 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-margin-waterfall-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sb-margin-waterfall-legend i {
  width: 13px;
  height: 9px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.sb-margin-waterfall-legend .is-keep {
  background: var(--accent);
}

.sb-margin-waterfall-legend .is-cut {
  background: var(--coral);
}

.sb-margin-waterfall-bands {
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px dashed var(--line-strong);
}

.sb-margin-waterfall-bandhead {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 10px;
  margin-bottom: 10px;
  font-size: 12.5px;
  font-weight: 660;
  color: var(--ink);
}

.sb-margin-waterfall-mark-info,
.sb-margin-waterfall-unit {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-margin-waterfall-bandrow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 168px;
  align-items: center;
  column-gap: 12px;
  margin-bottom: 7px;
}

.sb-margin-waterfall-bandtrack {
  position: relative;
  min-width: 0;
  height: 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-margin-waterfall-band {
  position: absolute;
  top: 2px;
  bottom: 2px;
  border: 1px solid var(--accent);
  border-radius: 5px;
  background: var(--accent-soft);
  transition: width 0.35s var(--ease), left 0.35s var(--ease);
}

.sb-margin-waterfall-mark {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  border-left: 1px dashed var(--coral);
}

.sb-margin-waterfall-bandlabel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  text-align: right;
  color: var(--ink-2);
}

.sb-margin-waterfall-bandlabel em {
  font-style: normal;
  color: var(--faint);
}

.sb-margin-waterfall-bandscale {
  position: relative;
  min-width: 0;
  height: 14px;
}

.sb-margin-waterfall-scaletick {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
  white-space: nowrap;
}

.sb-margin-waterfall-scaletick.is-first {
  transform: none;
}

.sb-margin-waterfall-scaletick.is-last {
  transform: translateX(-100%);
}

@media (max-width: 760px) {
  .sb-margin-waterfall-plot {
    grid-template-columns: minmax(0, 1fr) 86px;
    column-gap: 8px;
  }

  .sb-margin-waterfall-note {
    flex-basis: 100%;
    font-size: 11.5px;
  }

  .sb-margin-waterfall-track {
    height: 26px;
  }

  .sb-margin-waterfall-bandrow {
    grid-template-columns: minmax(0, 1fr) 118px;
    column-gap: 8px;
  }

  .sb-margin-waterfall-bandtrack {
    height: 18px;
  }

  .sb-margin-waterfall-bandlabel {
    font-size: 9.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-margin-waterfall-base,
  .sb-margin-waterfall-keep,
  .sb-margin-waterfall-cut,
  .sb-margin-waterfall-band {
    transition: none;
  }
}
</style>
