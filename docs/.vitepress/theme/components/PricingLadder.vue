<script setup lang="ts">
interface Tier {
  name: string
  price: number
  keepPerOrder: number
  orders: number
  gross: number
  pressure: number
  pressureLabel: string
  note: string
}

// 草稿口径（待核）：单量、毛利、压力都是同一条产品线上的示意推算，不是任何一家的真实报表。
const TIERS: Tier[] = [
  {
    name: '低价冲量',
    price: 39,
    keepPerOrder: 6,
    orders: 900,
    gross: 5400,
    pressure: 3,
    pressureLabel: '高（备货深、退货多、客服忙）',
    note: '转化率好看，钱没多赚：一单只留 6 块，要处理的货和售后却翻了一倍。'
  },
  {
    name: '中间常规',
    price: 89,
    keepPerOrder: 22,
    orders: 420,
    gross: 9240,
    pressure: 2,
    pressureLabel: '中（正常备货与售后）',
    note: '单价、量、事三样勉强平衡，通常是给生意而非给面子。'
  },
  {
    name: '高价窄众',
    price: 219,
    keepPerOrder: 78,
    orders: 110,
    gross: 8580,
    pressure: 1,
    pressureLabel: '低（单少但要一对一沟通）',
    note: '一单顶低价三单，但要接受「这个月就这十几个人买」。'
  }
]

const MAX_GROSS = Math.max(...TIERS.map((t) => t.gross))
const MAX_ORDERS = Math.max(...TIERS.map((t) => t.orders))
const MAX_PRESSURE = 3
// 不用 toLocaleString：不同 ICU 环境的分组符不一致，会让服务端与客户端首屏文案不一样
const money = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ',')
const grossPct = (t: Tier) => (t.gross / MAX_GROSS) * 100
const ordersPct = (t: Tier) => (t.orders / MAX_ORDERS) * 100
const pressurePct = (t: Tier) => (t.pressure / MAX_PRESSURE) * 100
const isBest = (t: Tier) => t.gross === MAX_GROSS
</script>

<template>
  <div class="sb-pricing-ladder sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Price Ladder · 降价买的是什么</span>
      <p class="sb-widget-sub">同一件货三种价。看的不是哪个转化率高，是哪一个月底真留下钱。</p>
    </div>

    <p class="sb-pricing-ladder-legend" aria-hidden="true">
      <span><i class="is-gross"></i>月毛利</span>
      <span><i class="is-orders"></i>月单量</span>
      <span><i class="is-pressure"></i>库存与售后压力</span>
      <span class="sb-pricing-ladder-unit">条长按本图最大值归一化，绝对数在右侧</span>
    </p>

    <ol class="sb-pricing-ladder-rows">
      <li v-for="t in TIERS" :key="t.name" class="sb-pricing-ladder-tier">
        <div class="sb-pricing-ladder-meta">
          <span class="sb-pricing-ladder-name">{{ t.name }}</span>
          <span class="sb-pricing-ladder-price">¥{{ t.price }} / 单 · 一单留 ¥{{ t.keepPerOrder }}</span>
        </div>

        <div class="sb-pricing-ladder-line">
          <div class="sb-pricing-ladder-track">
            <i
              class="sb-pricing-ladder-bar is-gross"
              :class="{ 'is-best': isBest(t) }"
              :style="{ width: grossPct(t) + '%' }"
            ></i>
          </div>
          <span class="sb-pricing-ladder-val">月毛利 ¥{{ money(t.gross) }}</span>
        </div>

        <div class="sb-pricing-ladder-line">
          <div class="sb-pricing-ladder-track">
            <i class="sb-pricing-ladder-bar is-orders" :style="{ width: ordersPct(t) + '%' }"></i>
          </div>
          <span class="sb-pricing-ladder-val">月单量 {{ t.orders }} 单</span>
        </div>

        <div class="sb-pricing-ladder-line">
          <div class="sb-pricing-ladder-track">
            <i class="sb-pricing-ladder-bar is-pressure" :style="{ width: pressurePct(t) + '%' }"></i>
          </div>
          <span class="sb-pricing-ladder-val">{{ t.pressureLabel }}</span>
        </div>

        <p class="sb-pricing-ladder-note">{{ t.note }}</p>
      </li>
    </ol>

    <span class="sr-only">
      三档定价，同一件货的示意推算、待核。低价冲量：单价 39 元，一单留下 6
      元，预计月单量 900 单，月毛利约 5,400 元，库存与售后压力高（备货深、退货多、客服忙）。
      中间常规：单价 89 元，一单留下 22 元，月单量 420 单，月毛利约 9,240 元，压力中。
      高价窄众：单价 219 元，一单留下 78 元，月单量 110 单，月毛利约 8,580 元，压力低但要做一对一沟通。
      三档里月毛利最高的是中间常规约 9,240 元，最低的是低价冲量约 5,400 元，比中间档少约四成。
    </span>

    <p class="sb-cap">
      把价从 <b>89 元</b> 砍到 <b>39 元</b>，单量从 <b>420 单</b> 涨到 <b>900 单</b>
      看着很热闹，月毛利却从 <b>约 9,240 元</b> 掉到 <b>约 5,400 元</b>，少了差不多四成，压力还从「中」跳到「高」。定价改的是「谁来买、你要干多少事」，
      <b>降价是拿真金白银买转化率</b>：毛利损失立刻到账，单量提升慢慢才来（以上均为示意口径，待核）。
    </p>
  </div>
</template>

<style scoped>
.sb-pricing-ladder-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 0 0 16px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-pricing-ladder-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.sb-pricing-ladder-legend i {
  width: 13px;
  height: 9px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
}

.sb-pricing-ladder-legend .is-gross {
  background: var(--accent);
}

.sb-pricing-ladder-legend .is-orders {
  background: var(--blue);
}

.sb-pricing-ladder-legend .is-pressure {
  background: var(--coral);
}

.sb-pricing-ladder-rows {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-pricing-ladder-tier {
  padding: 12px 0;
  border-bottom: 1px dashed var(--line-strong);
}

.sb-pricing-ladder-tier:last-child {
  border-bottom: none;
}

.sb-pricing-ladder-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 10px;
  margin-bottom: 8px;
}

.sb-pricing-ladder-name {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-pricing-ladder-price {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

/* 条单独一格，数值另起一格：不让 width:xx% 和文字抢同一行 */
.sb-pricing-ladder-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  align-items: center;
  column-gap: 12px;
  margin-bottom: 6px;
}

.sb-pricing-ladder-track {
  min-width: 0;
  height: 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-pricing-ladder-bar {
  display: block;
  height: 100%;
  min-width: 5px;
  border-radius: 9px;
  transition: width 0.35s var(--ease);
}

.sb-pricing-ladder-bar.is-gross {
  background: var(--accent);
  opacity: 0.7;
}

.sb-pricing-ladder-bar.is-gross.is-best {
  opacity: 1;
}

.sb-pricing-ladder-bar.is-orders {
  background: var(--blue);
  opacity: 0.75;
}

.sb-pricing-ladder-bar.is-pressure {
  background: var(--coral);
  opacity: 0.8;
}

.sb-pricing-ladder-val {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sb-pricing-ladder-note {
  margin: 6px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

@media (max-width: 760px) {
  .sb-pricing-ladder-legend .sb-pricing-ladder-unit {
    flex-basis: 100%;
  }

  /* 窄屏数值挪到条下面一行，不再挤同一格 */
  .sb-pricing-ladder-line {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 3px;
    margin-bottom: 9px;
  }

  .sb-pricing-ladder-val {
    font-size: 10px;
    white-space: normal;
  }

  .sb-pricing-ladder-track {
    height: 18px;
  }

  .sb-pricing-ladder-note {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-pricing-ladder-bar {
    transition: none;
  }
}
</style>
