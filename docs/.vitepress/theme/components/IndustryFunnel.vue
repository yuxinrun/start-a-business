<script setup lang="ts">
interface Layer {
  name: string
  rule: string
  from: number
  to: number
  why: string
}

// 口径（待核）：这里的 100 是「手里的想法数」，不是市场容量；每层只留一刀
const LAYERS: Layer[] = [
  {
    name: '第一刀 · 算不算得清一单账',
    rule: '一单卖多少钱、一单花多少钱、最后剩多少钱',
    from: 100,
    to: 20,
    why: '大部分想法死在这一步：嘴上说「毛利挺高」，真把原料、人工、房租、投流摊到一单上，人就沉默了。算不清不是生意难，是还没开始。'
  },
  {
    name: '第二刀 · 你够不够得着客户',
    rule: '前五十个客户从你现有的关系里来',
    from: 20,
    to: 5,
    why: '需求是真的，可客户你一个都不认识，那这份需求就是别人的。剩下这五个，是你能打电话、能上门、能当场被拒绝的那种。'
  },
  {
    name: '第三刀 · 亏得起、还在不在',
    rule: '这轮亏完还能站住，一年后这件事还转得动',
    from: 5,
    to: 1,
    why: '最后那一个通常不是最聪明的点子，是你输得起、能在场里待得最久的那个。淘汰理由从来不是运气，是钱包和时间。'
  }
]

const TOTAL = 100
const pct = (n: number) => (n / TOTAL) * 100
const layerOpacity = (i: number) => [1, 0.76, 0.56][Math.min(i, 2)]
</script>

<template>
  <div class="sb-industry-funnel sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Idea Funnel · 一百个想法怎么剩一个</span>
      <p class="sb-widget-sub">条的宽度就是还剩几个想法。看着心疼，但这才是真实的筛法。</p>
    </div>

    <ol class="sb-industry-funnel-steps">
      <li v-for="(layer, i) in LAYERS" :key="layer.name" class="sb-industry-funnel-step">
        <div class="sb-industry-funnel-plot">
          <div class="sb-industry-funnel-meta">
            <span class="sb-industry-funnel-name">{{ layer.name }}</span>
            <span class="sb-industry-funnel-rule">{{ layer.rule }}</span>
          </div>
          <div class="sb-industry-funnel-track">
            <span
              class="sb-industry-funnel-pool"
              :style="{ width: pct(layer.from) + '%' }"
              aria-hidden="true"
            ></span>
            <span
              class="sb-industry-funnel-left"
              :style="{ width: pct(layer.to) + '%', opacity: layerOpacity(i) }"
              aria-hidden="true"
            ></span>
          </div>
          <span class="sb-industry-funnel-count">
            <b>{{ layer.from }}</b>
            <em>→ {{ layer.to }}</em>
          </span>
        </div>
        <p class="sb-industry-funnel-why">{{ layer.why }}</p>
      </li>
    </ol>

    <span class="sr-only">
      漏斗三层，宽度按剩下的想法数量等比例画：第一层，100 个想法里能算清一单账的只剩 20
      个，淘汰 80 个；第二层，20 个里你能直接接触客户的只剩 5 个；第三层，5
      个里亏得起、一年后还在的只剩 1 个。也就是 100 进 1 出。每层的淘汰理由写在图上，都不是运气。
    </span>

    <p class="sb-cap">
      <b>100 个</b>想法进来，能算清一单账的只剩 <b>20 个</b>，够得着客户的 <b>5 个</b>，最后
      <b>1 个</b>。这一路砍掉的不是运气不好，是「说不清一单赚多少」和「客户一个都不认识」这两件事——所以别攒点子，先把一个点子的账算到能写下来。
    </p>
  </div>
</template>

<style scoped>
.sb-industry-funnel-steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-industry-funnel-step {
  padding: 12px 0;
  border-bottom: 1px dashed var(--line-strong);
}

.sb-industry-funnel-step:first-child {
  padding-top: 2px;
}

.sb-industry-funnel-step:last-child {
  border-bottom: none;
  padding-bottom: 2px;
}

/* 条形单独占一列，数值另起一列：width:xx% 不跟标签抢同一行 */
.sb-industry-funnel-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 82px;
  column-gap: 12px;
  row-gap: 7px;
  align-items: center;
}

.sb-industry-funnel-meta {
  grid-column: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
}

.sb-industry-funnel-name {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-industry-funnel-rule {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-industry-funnel-track {
  grid-column: 1;
  position: relative;
  min-width: 0;
  height: 26px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-industry-funnel-pool {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  border-right: 1px dashed var(--line-strong);
}

.sb-industry-funnel-left {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 2px;
  min-width: 4px;
  border-radius: 4px;
  background: var(--accent);
  transition: width 0.35s var(--ease);
}

.sb-industry-funnel-count {
  grid-column: 2;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  white-space: nowrap;
}

.sb-industry-funnel-count b {
  font-size: 13px;
  color: var(--accent);
}

.sb-industry-funnel-count em {
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-industry-funnel-why {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--muted);
}

@media (max-width: 760px) {
  .sb-industry-funnel-plot {
    grid-template-columns: minmax(0, 1fr) 62px;
    column-gap: 8px;
  }

  .sb-industry-funnel-track {
    height: 32px;
  }

  .sb-industry-funnel-rule {
    flex-basis: 100%;
    font-size: 9.5px;
  }

  .sb-industry-funnel-why {
    font-size: 12.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-industry-funnel-left {
    transition: none;
  }
}
</style>
