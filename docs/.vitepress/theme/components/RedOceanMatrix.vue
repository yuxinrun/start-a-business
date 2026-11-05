<script setup lang="ts">
interface Dot {
  name: string
  race: number
  growth: number
  side: 'left' | 'right'
  edge: string
}

// 草稿口径（全部待核）：竞争密度、需求增速都是 0–100 的相对打分，不是行业统计值。
const DOTS: Dot[] = [
  { name: '社区养老照护', race: 24, growth: 82, side: 'right', edge: '要人、要耐心、要熬资质' },
  { name: '企业 SaaS 分销', race: 38, growth: 66, side: 'right', edge: '赚的是服务费，不是差价' },
  { name: '宠物医疗', race: 58, growth: 58, side: 'right', edge: '设备与医生都先要钱' },
  { name: '职业技能培训', race: 72, growth: 44, side: 'left', edge: '政策与退费规则一变就抖' },
  { name: '跨境电商 3C', race: 86, growth: 34, side: 'left', edge: '库存和退货压死人' },
  { name: '奶茶加盟', race: 93, growth: 16, side: 'left', edge: '位置就是你的天花板' }
]

// 先算好末端坐标，再写映射：所有点与文字都必须落在 viewBox 内
const VB_W = 680
const VB_H = 430
const X0 = 74
const X1 = 594
const Y0 = 52
const Y1 = 356
const xOf = (v: number) => X0 + (v / 100) * (X1 - X0)
const yOf = (v: number) => Y1 - (v / 100) * (Y1 - Y0)

const QUADRANTS = [
  { x: X0 + 6, y: Y0 + 16, anchor: 'start', text: '低竞争 × 高增长：少见的好牌' },
  { x: X1 - 6, y: Y0 + 16, anchor: 'end', text: '高竞争 × 高增长：值得进，但手里要有刀' },
  { x: X0 + 6, y: Y1 - 10, anchor: 'start', text: '低竞争 × 低增长：小生意，稳但别融钱' },
  { x: X1 - 6, y: Y1 - 10, anchor: 'end', text: '高竞争 × 低增长：存量厮杀，别空手去' }
]

const tone = (d: Dot) => (d.race >= 70 ? 'is-hot' : d.race <= 40 ? 'is-cool' : 'is-mid')
const labelX = (d: Dot) => xOf(d.race) + (d.side === 'right' ? 14 : -14)
</script>

<template>
  <div class="sb-red-ocean-matrix sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Competition Matrix · 红海什么时候值得进</span>
      <p class="sb-widget-sub">横着看这条道挤不挤，竖着看还有没有人要。两个数一起看，才叫判断。</p>
    </div>

    <div class="sb-red-ocean-matrix-legend" aria-hidden="true">
      <span><i class="is-cool"></i>竞争密度 40 以下</span>
      <span><i class="is-mid"></i>40 到 70</span>
      <span><i class="is-hot"></i>70 以上（很挤）</span>
      <span class="sb-red-ocean-matrix-unit">打分 0–100，示意口径、待核</span>
    </div>

    <figure class="sb-red-ocean-matrix-fig">
      <svg
        class="sb-red-ocean-matrix-svg"
        :viewBox="`0 0 ${VB_W} ${VB_H}`"
        role="img"
        aria-label="六个行业的竞争密度与需求增速散点图，数字见下方文字说明"
      >
        <rect
          class="sb-red-ocean-matrix-frame"
          :x="X0"
          :y="Y0"
          :width="X1 - X0"
          :height="Y1 - Y0"
        />
        <line class="sb-red-ocean-matrix-split" :x1="xOf(50)" :y1="Y0" :x2="xOf(50)" :y2="Y1" />
        <line class="sb-red-ocean-matrix-split" :x1="X0" :y1="yOf(50)" :x2="X1" :y2="yOf(50)" />

        <text
          v-for="q in QUADRANTS"
          :key="q.text"
          class="sb-red-ocean-matrix-quadrant"
          :x="q.x"
          :y="q.y"
          :text-anchor="q.anchor"
        >
          {{ q.text }}
        </text>

        <text v-for="t in [0, 50, 100]" :key="'x' + t" class="sb-red-ocean-matrix-tick" :x="xOf(t)" :y="Y1 + 22" text-anchor="middle">
          {{ t }}
        </text>
        <text v-for="t in [0, 50, 100]" :key="'y' + t" class="sb-red-ocean-matrix-tick" :x="X0 - 12" :y="yOf(t) + 4" text-anchor="end">
          {{ t }}
        </text>

        <text class="sb-red-ocean-matrix-axis" :x="(X0 + X1) / 2" :y="Y1 + 46" text-anchor="middle">
          竞争密度（低 → 高）
        </text>
        <text class="sb-red-ocean-matrix-axis" x="26" :y="(Y0 + Y1) / 2" text-anchor="middle" transform="rotate(-90 26 204)">
          需求增速（慢 → 快）
        </text>

        <g v-for="d in DOTS" :key="d.name">
          <circle
            class="sb-red-ocean-matrix-halo"
            :class="tone(d)"
            :cx="xOf(d.race)"
            :cy="yOf(d.growth)"
            r="13"
          />
          <circle
            class="sb-red-ocean-matrix-dot"
            :class="tone(d)"
            :cx="xOf(d.race)"
            :cy="yOf(d.growth)"
            r="6.5"
          />
          <text class="sb-red-ocean-matrix-name" :x="labelX(d)" :y="yOf(d.growth) - 3" :text-anchor="d.side === 'right' ? 'start' : 'end'">
            {{ d.name }}
          </text>
          <text class="sb-red-ocean-matrix-num" :x="labelX(d)" :y="yOf(d.growth) + 12" :text-anchor="d.side === 'right' ? 'start' : 'end'">
            竞争 {{ d.race }} · 增速 {{ d.growth }}
          </text>
        </g>
      </svg>

      <div class="sb-red-ocean-matrix-list" aria-hidden="true">
        <div v-for="d in DOTS" :key="d.name" class="sb-red-ocean-matrix-item">
          <span class="sb-red-ocean-matrix-iname">{{ d.name }}</span>
          <div class="sb-red-ocean-matrix-iblock">
            <div class="sb-red-ocean-matrix-itrack">
              <i class="is-risk" :style="{ width: d.race + '%' }"></i>
            </div>
            <span class="sb-red-ocean-matrix-ival">竞争 {{ d.race }}</span>
          </div>
          <div class="sb-red-ocean-matrix-iblock">
            <div class="sb-red-ocean-matrix-itrack">
              <i class="is-keep" :style="{ width: d.growth + '%' }"></i>
            </div>
            <span class="sb-red-ocean-matrix-ival">增速 {{ d.growth }}</span>
          </div>
          <span class="sb-red-ocean-matrix-iedge">{{ d.edge }}</span>
        </div>
      </div>

      <span class="sr-only">
        六个行业在二维图上的位置，打分 0 到 100，都是示意口径、待核。横轴竞争密度、纵轴需求增速：
        社区养老照护 竞争 24、增速 82，它的刀是「要人、要耐心、要熬资质」；
        企业 SaaS 分销 竞争 38、增速 66，赚的是服务费不是差价；
        宠物医疗 竞争 58、增速 58，设备与医生都先要钱；
        职业技能培训 竞争 72、增速 44，政策与退费规则一变就抖；
        跨境电商 3C 竞争 86、增速 34，库存和退货压死人；
        奶茶加盟 竞争 93、增速 16，位置就是你的天花板。
        四个象限的说法是：低竞争高增长是少见的好牌；高竞争高增长值得进但手里要有刀；
        低竞争低增长是小生意，稳但别融钱；高竞争低增长是存量厮杀，别空手去。
      </span>
    </figure>

    <p class="sb-cap">
      奶茶加盟竞争密度 <b>93</b>、需求增速只剩 <b>16</b>，是典型「很多人想开、更多人已开」；社区养老照护竞争
      <b>24</b>、增速 <b>82</b>，挤得轻，但要付出人和资质的代价。结论不是「红海不能进」，是
      <b>红海不能空手进</b>——你得先在图上找到自己的那把刀（打分与增速均为示意口径，待核）。
    </p>
  </div>
</template>

<style scoped>
.sb-red-ocean-matrix-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-red-ocean-matrix-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sb-red-ocean-matrix-legend i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
}

.sb-red-ocean-matrix-legend .is-cool {
  background: var(--accent);
}

.sb-red-ocean-matrix-legend .is-mid {
  background: var(--blue);
}

.sb-red-ocean-matrix-legend .is-hot {
  background: var(--coral);
}

.sb-red-ocean-matrix-unit {
  color: var(--faint);
}

.sb-red-ocean-matrix-fig {
  margin: 0;
}

.sb-red-ocean-matrix-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-frame) {
  fill: var(--panel-2);
  stroke: var(--line-strong);
  stroke-width: 1;
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-split) {
  stroke: var(--line-strong);
  stroke-width: 1;
  stroke-dasharray: 4 5;
  opacity: 0.7;
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-tick) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  fill: var(--faint);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-axis) {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  fill: var(--muted);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-quadrant) {
  font-family: var(--font-sans);
  font-size: 12px;
  fill: var(--muted);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-name) {
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 660;
  fill: var(--ink);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-num) {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  fill: var(--faint);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-dot) {
  stroke-width: 1.5;
  transition: r 0.3s var(--ease);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-halo) {
  stroke: none;
  fill-opacity: 0.16;
}

.sb-red-ocean-matrix-svg :deep(.is-cool) {
  fill: var(--accent);
  stroke: var(--accent);
}

.sb-red-ocean-matrix-svg :deep(.is-mid) {
  fill: var(--blue);
  stroke: var(--blue);
}

.sb-red-ocean-matrix-svg :deep(.is-hot) {
  fill: var(--coral);
  stroke: var(--coral);
}

.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-halo.is-cool),
.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-halo.is-mid),
.sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-halo.is-hot) {
  stroke: none;
}

/* 窄屏是另一套读法：图留着当印象，数字改成纵列 */
.sb-red-ocean-matrix-list {
  display: none;
}

@media (max-width: 760px) {
  .sb-red-ocean-matrix-legend {
    display: none;
  }

  .sb-red-ocean-matrix-list {
    display: grid;
    gap: 12px;
    margin-top: 14px;
  }

  .sb-red-ocean-matrix-item {
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--line-strong);
  }

  .sb-red-ocean-matrix-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .sb-red-ocean-matrix-iname {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    font-weight: 660;
    color: var(--ink);
  }

  .sb-red-ocean-matrix-iblock {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 74px;
    align-items: center;
    column-gap: 10px;
    margin-bottom: 5px;
  }

  .sb-red-ocean-matrix-itrack {
    min-width: 0;
    height: 10px;
    border: 1px solid var(--line-strong);
    border-radius: 999px;
    background: var(--panel-2);
    overflow: hidden;
  }

  .sb-red-ocean-matrix-itrack i {
    display: block;
    height: 100%;
    min-width: 4px;
    border-radius: 999px;
    transition: width 0.3s var(--ease);
  }

  .sb-red-ocean-matrix-itrack .is-risk {
    background: var(--coral);
    opacity: 0.8;
  }

  .sb-red-ocean-matrix-itrack .is-keep {
    background: var(--accent);
    opacity: 0.8;
  }

  .sb-red-ocean-matrix-ival {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.06em;
    text-align: right;
    color: var(--ink-2);
    white-space: nowrap;
  }

  .sb-red-ocean-matrix-iedge {
    font-size: 11.5px;
    color: var(--muted);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-red-ocean-matrix-svg :deep(.sb-red-ocean-matrix-dot),
  .sb-red-ocean-matrix-itrack i {
    transition: none;
  }
}
</style>
