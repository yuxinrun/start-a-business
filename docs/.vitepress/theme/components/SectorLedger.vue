<script setup lang="ts">
interface LedgerRow {
  sector: string
  value: number
  shown: string
}

interface LedgerMetric {
  label: string
  scale: string
  rows: LedgerRow[]
}

// 草稿口径（全部待核）：五项都是「首单/首年」层面的粗略量级，不是任何一家店的真实账。
// 条长只做同一指标内的相对比较（该指标里最大值 = 100%），绝对值一律写在右侧与 sr-only 里。
const METRICS: LedgerMetric[] = [
  {
    label: '首单毛利率',
    scale: '条越长 = 一单剩的比例越高（还没扣房租、管理、税）',
    rows: [
      { sector: '内容与知识付费', value: 80, shown: '约 80%' },
      { sector: '社区服务（维修、保洁）', value: 70, shown: '约 70%' },
      { sector: '餐饮门店', value: 55, shown: '约 55%' },
      { sector: '企业服务外包', value: 45, shown: '约 45%' },
      { sector: '电商零售', value: 35, shown: '约 35%' }
    ]
  },
  {
    label: '复购周期',
    scale: '条越长 = 下一单等得越久',
    rows: [
      { sector: '餐饮门店', value: 7, shown: '约 7 天' },
      { sector: '内容与知识付费', value: 30, shown: '约 30 天' },
      { sector: '电商零售', value: 45, shown: '约 45 天' },
      { sector: '社区服务（维修、保洁）', value: 90, shown: '约 90 天' },
      { sector: '企业服务外包', value: 180, shown: '约 180 天' }
    ]
  },
  {
    label: '启动资金量级',
    scale: '条越长 = 进门要先掏的钱越多',
    rows: [
      { sector: '餐饮门店', value: 25, shown: '约 25 万元' },
      { sector: '电商零售', value: 12, shown: '约 12 万元' },
      { sector: '企业服务外包', value: 8, shown: '约 8 万元' },
      { sector: '社区服务（维修、保洁）', value: 3, shown: '约 3 万元' },
      { sector: '内容与知识付费', value: 2, shown: '约 2 万元' }
    ]
  },
  {
    label: '回本周期',
    scale: '条越长 = 先亏的那段时间越久',
    rows: [
      { sector: '餐饮门店', value: 18, shown: '约 18 个月' },
      { sector: '电商零售', value: 14, shown: '约 14 个月' },
      { sector: '企业服务外包', value: 10, shown: '约 10 个月' },
      { sector: '内容与知识付费', value: 8, shown: '约 8 个月' },
      { sector: '社区服务（维修、保洁）', value: 6, shown: '约 6 个月' }
    ]
  }
]

const maxOf = (metric: LedgerMetric) => Math.max(...metric.rows.map((r) => r.value))
const barPct = (metric: LedgerMetric, row: LedgerRow) => (row.value / maxOf(metric)) * 100
</script>

<template>
  <div class="sb-sector-ledger sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Sector Ledger · 五种生意的账本</span>
      <p class="sb-widget-sub">同一套四项指标，量五种生意各自缺哪一口。条长只是比大小，右边那列才是真数。</p>
    </div>

    <p class="sb-sector-ledger-legend" aria-hidden="true">
      归一化说明：每项指标里条最长的那家 = 100%，其余按比例缩短；绝对值一律写在右侧。
    </p>

    <section v-for="metric in METRICS" :key="metric.label" class="sb-sector-ledger-block">
      <div class="sb-sector-ledger-head">
        <span class="sb-sector-ledger-label">{{ metric.label }}</span>
        <span class="sb-sector-ledger-scale">{{ metric.scale }}</span>
      </div>

      <div class="sb-sector-ledger-rows">
        <div v-for="row in metric.rows" :key="row.sector" class="sb-sector-ledger-row">
          <span class="sb-sector-ledger-name">{{ row.sector }}</span>
          <span class="sb-sector-ledger-track">
            <i
              class="sb-sector-ledger-bar"
              :style="{ width: barPct(metric, row) + '%' }"
              aria-hidden="true"
            ></i>
          </span>
          <span class="sb-sector-ledger-val">{{ row.shown }}</span>
        </div>
      </div>
    </section>

    <span class="sr-only">
      四类指标、五种生意，数字为示意草稿口径、待核。首单毛利率：内容与知识付费约
      80%，社区服务（维修、保洁）约 70%，餐饮门店约 55%，企业服务外包约 45%，电商零售约
      35%，这里的毛利还没扣房租、管理和税。复购周期：餐饮约 7 天，内容与知识付费约 30
      天，电商约 45 天，社区服务约 90 天，企业服务外包约 180 天。启动资金量级：餐饮约 25
      万元，电商约 12 万元，企业服务外包约 8 万元，社区服务约 3
      万元，内容与知识付费约 2 万元。回本周期：餐饮约 18 个月，电商约 14
      个月，企业服务外包约 10 个月，内容与知识付费约 8 个月，社区服务约 6
      个月。税收与社保的具体费率以当地当年口径为准。
    </span>

    <p class="sb-cap">
      餐饮毛利 <b>约 55%</b> 听着不差，但要 <b>约 25 万元</b>才进得了场、<b>约 18
      个月</b>才回本；社区服务毛利 <b>约 70%</b>、<b>约 3 万元</b>进场、<b>约 6
      个月</b>回本，唯一难受的是复购要等 <b>约 90 天</b>。所以「哪类生意好」没有标准答案，只有你手里有几万块、又等得起几个月——量级和费率都以当地当年口径为准。
    </p>
  </div>
</template>

<style scoped>
.sb-sector-ledger-legend {
  margin: 0 0 16px;
  padding: 8px 10px;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.6;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-sector-ledger-block + .sb-sector-ledger-block {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px dashed var(--line-strong);
}

.sb-sector-ledger-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  margin-bottom: 9px;
}

.sb-sector-ledger-label {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-sector-ledger-scale {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-sector-ledger-rows {
  display: grid;
  gap: 7px;
}

.sb-sector-ledger-row {
  display: grid;
  grid-template-columns: 148px minmax(0, 1fr) 92px;
  align-items: center;
  column-gap: 12px;
}

.sb-sector-ledger-name {
  min-width: 0;
  font-size: 12px;
  line-height: 1.35;
  color: var(--ink-2);
}

.sb-sector-ledger-track {
  display: block;
  min-width: 0;
  height: 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--panel-3);
  overflow: hidden;
}

.sb-sector-ledger-bar {
  display: block;
  height: 100%;
  min-width: 5px;
  border-radius: 999px;
  background: var(--blue);
  opacity: 0.82;
  transition: width 0.35s var(--ease);
}

.sb-sector-ledger-val {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-align: right;
  color: var(--ink-2);
  white-space: nowrap;
}

@media (max-width: 760px) {
  /* 窄屏改名在上、条在下，数值单独占一列：条不再和名字抢同一行 */
  .sb-sector-ledger-row {
    grid-template-columns: minmax(0, 1fr) 82px;
    row-gap: 4px;
  }

  .sb-sector-ledger-name {
    grid-column: 1;
    grid-row: 1;
    font-size: 12.5px;
  }

  .sb-sector-ledger-track {
    grid-column: 1;
    grid-row: 2;
    height: 14px;
  }

  .sb-sector-ledger-val {
    grid-column: 2;
    grid-row: 1 / span 2;
    font-size: 10.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-sector-ledger-bar {
    transition: none;
  }
}
</style>
