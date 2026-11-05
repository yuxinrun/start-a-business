<script setup lang="ts">
type Key = 'liability' | 'tax' | 'equity' | 'who'

interface Field {
  key: Key
  label: string
}

interface Entity {
  en: string
  name: string
  tag: string
  tone: 'no' | 'alt' | 'yes'
  values: Record<Key, string>
}

const FIELDS: Field[] = [
  { key: 'liability', label: '责任边界' },
  { key: 'tax', label: '税' },
  { key: 'equity', label: '能否发股权融资' },
  { key: 'who', label: '适合谁' }
]

// 框架性描述，不是税务建议：每一格都以当年当地口径与专业意见为准。
const ENTITIES: Entity[] = [
  {
    en: 'Sole Proprietor (个体工商户)',
    name: '个体工商户',
    tag: '没有股权这个东西',
    tone: 'no',
    values: {
      liability: '无限责任。个人经营以个人财产承担，家庭经营以家庭财产承担——欠 50 万，家里的东西可能真进去。',
      tax: '不交企业所得税，按「经营所得」缴个人所得税。核定还是查账、适用哪档，以当地当年口径为准。',
      equity: '不能。它没有股份可发，也做不了股权激励；投资人只能以借款或合伙的方式进来。',
      who: '一个人或夫妻店、先小成本试水、不打算融钱、对外责任不大的生意。'
    }
  },
  {
    en: 'Wholly-owned Enterprise (个人独资企业)',
    name: '个人独资企业',
    tag: '仍是无限责任',
    tone: 'no',
    values: {
      liability: '投资人以个人财产对企业债务承担无限责任。名字里有"独资"，风险里可没有"隔离"。',
      tax: '同样不交企业所得税，按经营所得缴个税；具体征收方式看当地。',
      equity: '不能发股权。要引入外部钱，通常只能转让整个企业，或改组织形式。',
      who: '设计、咨询、工作室这类"一个老板加一门手艺"，客户认的是你这个人。'
    }
  },
  {
    en: 'Partnership (合伙企业)',
    name: '合伙企业',
    tag: '份额可以转，不能公开募',
    tone: 'alt',
    values: {
      liability: '普通合伙人对合伙债务承担无限连带责任；有限合伙企业里，执行事务的普通合伙人无限连带，不参与经营的有限合伙人以其认缴出资为限。',
      tax: '企业层面一般不缴企业所得税，走「先分后税」：分到每个合伙人手里，再按各自身份缴税。',
      equity: '不能公开发行股票，但可以加新合伙人、转让份额。它本身是员工持股平台的常见载体。',
      who: '几个合伙人一起干、基金、持股平台。协议里把"谁管事、谁掏钱、怎么散伙"写死。'
    }
  },
  {
    en: 'Limited Company (有限责任公司)',
    name: '有限责任公司',
    tag: '股权融资的标准载体',
    tone: 'yes',
    values: {
      liability: '股东一般以认缴出资为限。两个例外要记牢：认缴的出资得按期缴进来，你个人签的担保不会因为"有限公司"消失。',
      tax: '两道：企业层面一道所得税，分红到个人再一道。小型微利等有优惠，以当年口径为准，这里不给节税方案。',
      equity: '能。增资、转让股权、发期权都走得通；要上市，主体须改成股份有限公司。',
      who: '要融钱、要雇人、有对外合同与责任、要把股权发给核心团队的事。'
    }
  }
]
</script>

<template>
  <div class="sb-entity-compare sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Entity Compare · 个体户 / 个独 / 合伙 / 有限公司</span>
      <p class="sb-widget-sub">四栏四行，选的是"谁来背债、谁来交税、能不能卖股票"，不是哪个名字好听。</p>
    </div>

    <div class="sb-entity-compare-matrix">
      <div v-for="e in ENTITIES" :key="e.name" class="sb-entity-compare-col" :class="'is-' + e.tone">
        <header class="sb-entity-compare-colhead">
          <span class="sb-entity-compare-en">{{ e.en }}</span>
          <span class="sb-entity-compare-name">{{ e.name }}</span>
          <span class="sb-entity-compare-tag">{{ e.tag }}</span>
        </header>
        <div v-for="f in FIELDS" :key="f.key" class="sb-entity-compare-cell">
          <span class="sb-entity-compare-k">{{ f.label }}</span>
          <p class="sb-entity-compare-v">{{ e.values[f.key] }}</p>
        </div>
      </div>
    </div>

    <span class="sr-only">
      四种主体逐一说。个体工商户：责任是无限责任，个人经营以个人财产、家庭经营以家庭财产承担；
      税上不交企业所得税，按经营所得缴个人所得税；不能发股权融资；适合一个人或夫妻店先试水、不融钱、
      对外责任小的生意。个人独资企业：投资人以个人财产承担无限责任；不交企业所得税，按经营所得缴个税；
      不能发股权，要引外部钱一般只能转让整个企业或改组织形式；适合一个老板加一门手艺的工作室、咨询、设计。
      合伙企业：普通合伙人对合伙债务承担无限连带责任，有限合伙中执行事务合伙人无限连带、
      其他合伙人以认缴出资为限；企业层面一般不缴企业所得税，先分后税；不能公开发行股票，
      但可以加新合伙人、转让份额，本身常作员工持股平台；适合几个合伙人一起干、基金、持股平台。
      有限责任公司：股东一般以认缴出资为限，但认缴出资要按期缴进来、个人签的担保不因此消失；
      税是企业层面一道所得税、分红到个人再一道；能增资、能转让股权、能发期权，是股权融资的标准载体，
      上市主体须为股份有限公司；适合要融钱、要雇人、有对外责任、要发股权的团队。
      以上都是框架性描述，具体税额、征收方式与责任范围以当年当地口径与专业意见为准。
    </span>

    <p class="sb-cap">
      要不要设有限公司，取决于三件事：<b>要不要发股权</b>、<b>要不要雇人</b>、<b>有没有对外的合同责任</b>；
      跟"听起来正式"没有一分钱关系。反过来也成立——个体户不是低级版本，官方口径里成立三年以上的个体户占大头
      （具体比例口径待核）。真要做选择，把上表当成问律师和税务师的清单，而不是结论：
      全部以当年当地口径与专业意见为准，本站不提供任何避税安排。
    </p>
  </div>
</template>

<style scoped>
/* 桌面：每个主体是一"栏"，靠 grid-auto-flow: column 把 4×5 个格子按列填满，
   于是各栏同一行的格子自动等高对齐——DOM 仍是"按主体"分组，窄屏直接变卡片。 */
.sb-entity-compare-matrix {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, auto));
  grid-auto-flow: column;
  gap: 1px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--line);
}

.sb-entity-compare-col {
  display: contents;
}

.sb-entity-compare-colhead {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 11px 11px 12px;
  background: var(--panel-2);
}

.sb-entity-compare-col.is-yes .sb-entity-compare-colhead {
  background: var(--accent-soft);
}

.sb-entity-compare-col.is-alt .sb-entity-compare-colhead {
  background: var(--blue-soft);
}

.sb-entity-compare-en {
  font-family: var(--font-mono);
  font-size: 8.5px;
  line-height: 1.3;
  letter-spacing: 0.08em;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-entity-compare-name {
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-entity-compare-tag {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-entity-compare-col.is-yes .sb-entity-compare-tag {
  color: var(--accent);
}

.sb-entity-compare-col.is-alt .sb-entity-compare-tag {
  color: var(--blue);
}

.sb-entity-compare-cell {
  display: grid;
  gap: 4px;
  padding: 10px 11px;
  min-width: 0;
  background: var(--panel);
  transition: background-color 0.3s var(--ease);
}

.sb-entity-compare-cell:hover {
  background: var(--panel-2);
}

.sb-entity-compare-col.is-no .sb-entity-compare-cell:nth-child(4) .sb-entity-compare-v {
  color: var(--coral);
}

.sb-entity-compare-k {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-entity-compare-v {
  margin: 0;
  font-size: 11px;
  line-height: 1.65;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  /* 窄屏：栏变卡片，一张一张往下读，不横向滚动 */
  .sb-entity-compare-matrix {
    display: block;
    border: none;
    background: none;
    overflow: visible;
  }

  .sb-entity-compare-col {
    display: block;
    margin-bottom: 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: var(--shadow);
  }

  .sb-entity-compare-col.is-yes {
    border-color: var(--accent);
  }

  .sb-entity-compare-col.is-alt {
    border-color: var(--blue);
  }

  .sb-entity-compare-cell {
    border-bottom: 1px solid var(--line);
  }

  .sb-entity-compare-cell:nth-child(5) {
    border-bottom: none;
  }

  .sb-entity-compare-v {
    font-size: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-entity-compare-col,
  .sb-entity-compare-cell {
    transition: none;
  }
}
</style>
