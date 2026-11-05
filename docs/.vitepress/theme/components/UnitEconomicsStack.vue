<script setup lang="ts">
interface Seg {
  label: string
  value: number
  kind: 'cost' | 'keep'
}

interface Sample {
  name: string
  price: number
  unit: string
  segs: Seg[]
}

// 示意口径（待核）：把"一单"拆到只剩一个数字——贡献毛利
const SAMPLES: Sample[] = [
  {
    name: '咖啡店外带一杯',
    price: 22,
    unit: '杯',
    segs: [
      { label: '豆子牛奶奶盖', value: 5.5, kind: 'cost' },
      { label: '人工与房租分摊', value: 6.5, kind: 'cost' },
      { label: '平台抽成与投流', value: 3.2, kind: 'cost' },
      { label: '贡献毛利', value: 6.8, kind: 'keep' }
    ]
  },
  {
    name: '电商发出一单',
    price: 129,
    unit: '单',
    segs: [
      { label: '货款', value: 58, kind: 'cost' },
      { label: '包装与快递', value: 14, kind: 'cost' },
      { label: '佣金与投流', value: 26, kind: 'cost' },
      { label: '退货分摊', value: 8, kind: 'cost' },
      { label: '贡献毛利', value: 23, kind: 'keep' }
    ]
  },
  {
    name: '上门服务一单',
    price: 288,
    unit: '单',
    segs: [
      { label: '师傅分成', value: 150, kind: 'cost' },
      { label: '交通与耗材', value: 26, kind: 'cost' },
      { label: '获客成本', value: 45, kind: 'cost' },
      { label: '平台抽成', value: 12, kind: 'cost' },
      { label: '贡献毛利', value: 55, kind: 'keep' }
    ]
  }
]

const LEGEND = ['货款原料', '人工房租', '履约配送', '获客与抽成', '贡献毛利（留下的）']

const pctOf = (s: Sample, seg: Seg) => (seg.value / s.price) * 100
const keepOf = (s: Sample) => s.segs.find((x) => x.kind === 'keep')?.value ?? 0
const money = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1))
const costOpacity = (i: number) => [1, 0.76, 0.54, 0.34][Math.min(i, 3)]
</script>

<template>
  <div class="sb-unit-economics-stack sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Unit Economics · 一单到底赚多少</span>
      <p class="sb-widget-sub">同一张图，三种生意。看的不是谁卖得贵，是谁最后留得住钱。</p>
    </div>

    <div class="sb-unit-economics-legend" aria-hidden="true">
      <span v-for="(l, i) in LEGEND" :key="l" class="sb-unit-economics-key">
        <i :style="i === 4 ? {} : { background: 'var(--coral)', opacity: costOpacity(i) }"></i>{{ l }}
      </span>
    </div>

    <figure class="sb-unit-economics-fig">
      <div v-for="s in SAMPLES" :key="s.name" class="sb-unit-economics-row">
        <div class="sb-unit-economics-meta">
          <span class="sb-unit-economics-name">{{ s.name }}</span>
          <span class="sb-unit-economics-price">售价 ¥{{ money(s.price) }} / {{ s.unit }}</span>
        </div>
        <div class="sb-unit-economics-plot">
          <div class="sb-unit-economics-track">
            <span
              v-for="(seg, i) in s.segs"
              :key="seg.label"
              class="sb-unit-economics-seg"
              :class="seg.kind === 'keep' ? 'is-keep' : 'is-cost'"
              :style="
                seg.kind === 'keep'
                  ? { width: pctOf(s, seg) + '%' }
                  : { width: pctOf(s, seg) + '%', opacity: costOpacity(i) }
              "
            >
              <span class="sb-unit-economics-seg-label">{{ seg.label }}</span>
            </span>
          </div>
          <span class="sb-unit-economics-keep">
            ¥{{ money(keepOf(s)) }}
            <em>{{ Math.round((keepOf(s) / s.price) * 100) }}%</em>
          </span>
        </div>
      </div>
      <span class="sr-only">
        三种生意的一单拆解：咖啡店外带一杯售价 22 元，扣掉原料 5.5 元、人工房租分摊 6.5
        元、平台与投流 3.2 元，贡献毛利 6.8 元，占售价 31%；电商一单售价 129 元，扣货款
        58 元、包装快递 14 元、佣金投流 26 元、退货分摊 8 元，贡献毛利 23 元，占 18%；
        上门服务一单 288 元，扣师傅分成 150 元、交通耗材 26 元、获客 45 元、平台抽成 12
        元，贡献毛利 55 元，占 19%。数字为示意口径，不是任何一家店的真实账。
      </span>
    </figure>

    <p class="sb-cap">
      一杯 <b>22 块</b> 的咖啡最后留下 <b>6.8 块（31%）</b>，一单 <b>129 块</b>
      的电商货只留下 <b>23 块（18%）</b>。记住这条：贡献毛利是负的时候，
      <b>卖得越多亏得越多</b>——规模从来救不了单位经济，它只会把亏本的事做得更勤快。
    </p>
  </div>
</template>

<style scoped>
.sb-unit-economics-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 14px;
}

.sb-unit-economics-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-unit-economics-key i {
  width: 13px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
}

.sb-unit-economics-fig {
  margin: 0;
}

.sb-unit-economics-row {
  margin-bottom: 16px;
}

.sb-unit-economics-row:last-of-type {
  margin-bottom: 4px;
}

.sb-unit-economics-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 5px;
}

.sb-unit-economics-name {
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-unit-economics-price {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

/* 条形必须落在自己的网格里，右侧数值单独占一列：
   width:xx% 若拿"整行"当参照，窄屏一定溢出 */
.sb-unit-economics-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 74px;
  align-items: center;
  gap: 10px;
}

.sb-unit-economics-track {
  display: flex;
  min-width: 0;
  height: 30px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--panel-2);
}

.sb-unit-economics-seg {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  padding-left: 7px;
  border-right: 1px solid var(--panel);
  background: var(--coral);
  transition: width 0.3s var(--ease);
}

.sb-unit-economics-seg:last-child {
  border-right: none;
}

.sb-unit-economics-seg.is-keep {
  border: 1px solid var(--accent);
  background: var(--accent-soft);
}

.sb-unit-economics-seg-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.15;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sb-unit-economics-keep {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
  white-space: nowrap;
}

.sb-unit-economics-keep em {
  font-size: 9.5px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

@media (max-width: 760px) {
  .sb-unit-economics-legend {
    display: none;
  }

  .sb-unit-economics-plot {
    grid-template-columns: minmax(0, 1fr) 62px;
    gap: 8px;
  }

  .sb-unit-economics-track {
    height: 38px;
  }

  /* 窄屏放不下段内文字：改成"只读色块 + 右侧结论"，明细交给 sr-only 与正文 */
  .sb-unit-economics-seg-label {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-unit-economics-seg {
    transition: none;
  }
}
</style>
