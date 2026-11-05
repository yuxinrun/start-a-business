<script setup lang="ts">
interface Clause {
  en: string
  zh: string
  bite: boolean
  what: string
  how: string
  range: string
}

// 六条常见条款：只讲"这条讲什么 / 怎么咬人 / 常见区间"，不给谈判话术，不承诺能谈到什么条件。
const CLAUSES: Clause[] = [
  {
    en: 'Valuation',
    zh: '估值（pre / post）',
    bite: false,
    what: '你的公司这轮"算"多少钱。pre 是还没拿这笔钱时的价，post = pre + 本轮融到的钱，出让比例按 post 算。',
    how: '高估值不是好消息的代名词：它同时抬高了下一轮的门槛。下一轮涨不动就是折价融资（down round），条款会立刻变凶。',
    range: '早期没有全国统一区间，多为"要融多少 ÷ 愿意出让的比例"倒推出来（口径待核）'
  },
  {
    en: 'Liquidation Preference',
    zh: '清算优先权',
    bite: true,
    what: '公司被卖掉或清算时，钱先给谁、给几倍、给完还参不参与剩下的分配。',
    how: '"参与分配"再加上高于 1 倍的倍数，可能让创始团队在一次不算差的退出里几乎分不到钱——签的时候看不见，卖公司的当天才看见。',
    range: '早期最常见 1 倍、不参与分配（1× non-participating，待核）；参与分配与高于 1 倍属少见但确有发生'
  },
  {
    en: 'Anti-dilution',
    zh: '反稀释',
    bite: true,
    what: '下一轮的价格比这一轮低时，老投资人的换算比例要不要往上调整。',
    how: '一次下行融资就能触发它：公式会把你手里的股份再摊薄一次，而你在这件事里往往一个字都没签。',
    range: '常见的是广义加权平均（broad-based weighted average）；完全棘轮（full ratchet）条件极狠（区间待核）'
  },
  {
    en: 'Board Seats',
    zh: '董事会席位',
    bite: false,
    what: '谁在董事会有位置，以及哪些事项必须经过谁同意才能做。',
    how: '席位决定"谁能让你离开自己创办的公司"。否决事项清单写得太宽，日常每一件事都要回头请示，节奏就不再是你的。',
    range: '早期常见投资人 1 席外加观察员、创始人保持多数（结构待核，逐案不同）'
  },
  {
    en: 'Earn-out / Buyback',
    zh: '对赌与回购',
    bite: true,
    what: '业绩、上市时间这类指标没达到时，投资人能不能要求你按约定价格把股份买回去，或者补一笔钱。',
    how: '跟你个人或实际控制人签的那份，通常被认定有效并支持实际履行——"没做到"会变成你个人要掏的钱；跟公司签的那份，公司要回购一般得先完成减资，实操上很难走通（《九民纪要》第 5 条的口径，条文号与后续司法解释待核）。',
    range: '触发多为业绩或"某年前完成上市"；回购价多为"本金 + 年化利息"结构，年化数值不印具体值（待核）'
  },
  {
    en: 'Vesting & Non-compete',
    zh: '解锁与竞业',
    bite: false,
    what: '你的股份分几年兑现、离开时按什么价格回收，以及离开后多长时间内不能再做同类业务。',
    how: '"兑现完"不等于"已到手"：离职时的回购价条款才是重点。竞业限制这边，拿了补偿就要守；公司该给补偿却没给时，各地裁审口径并不一致。',
    range: '常见 4 年兑现加 1 年 cliff（待核）；竞业期限与补偿标准以当年当地口径与专业意见为准'
  }
]

const BITE_LIST = CLAUSES.filter((c) => c.bite).map((c) => c.zh)
</script>

<template>
  <div class="sb-term-sheet-anatomy sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Term Sheet Anatomy · 条款里真正咬人的是哪几条</span>
      <p class="sb-widget-sub">一份投资协议十几页，决定你未来五年的是这几段。</p>
    </div>

    <div class="sb-term-sheet-anatomy-legend" aria-hidden="true">
      <span class="sb-term-sheet-anatomy-key is-neutral"><i></i>中性：谈的是数字</span>
      <span class="sb-term-sheet-anatomy-key is-bite"><i></i>咬人狠：改的是结局</span>
    </div>

    <div class="sb-term-sheet-anatomy-grid">
      <article
        v-for="c in CLAUSES"
        :key="c.zh"
        class="sb-term-sheet-anatomy-card"
        :class="c.bite ? 'is-bite' : 'is-neutral'"
      >
        <header class="sb-term-sheet-anatomy-top">
          <span class="sb-term-sheet-anatomy-en">{{ c.en }}</span>
          <h4 class="sb-term-sheet-anatomy-zh">{{ c.zh }}</h4>
          <span class="sb-term-sheet-anatomy-sev">{{ c.bite ? '咬人狠' : '中性' }}</span>
        </header>

        <dl class="sb-term-sheet-anatomy-dl">
          <div class="sb-term-sheet-anatomy-line">
            <dt>这条讲什么</dt>
            <dd>{{ c.what }}</dd>
          </div>
          <div class="sb-term-sheet-anatomy-line">
            <dt>怎么咬人</dt>
            <dd>{{ c.how }}</dd>
          </div>
          <div class="sb-term-sheet-anatomy-line">
            <dt>常见区间</dt>
            <dd>{{ c.range }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <span class="sr-only">
      六条条款，按"这条讲什么、怎么咬人、常见区间"三行展开。标记为咬人狠的有三条：清算优先权、反稀释、
      对赌与回购；标记为中性的三条是估值（pre 与 post）、董事会席位、解锁与竞业。三组常见区间的说法是：
      早期清算优先权最常见 1 倍且不参与分配；反稀释常见广义加权平均，完全棘轮极狠；估值没有全国统一区间；
      董事会早期常见投资人一席加观察员、创始人保持多数；对赌触发多为业绩或上市时间，回购价多为本金加年化利息；
      解锁常见 4 年加 1 年 cliff。以上比例与年限都是通行口径的示意，属待核，
      实际以当年当地口径与专业意见为准。这一页不教谈判话术，也不承诺你能谈到什么条件。
    </span>

    <p class="sb-cap">
      六条里真正会改结局的是 <b>3 条</b>：{{ BITE_LIST.join('、') }}。它们的共同点是不改你拿到的钱，
      只改<b>最后剩下的钱归谁</b>。所以别问"这轮多少钱"，要问"<b>最坏情况下我还剩什么</b>"。
      本页不给谈判话术、也不承诺能谈到什么条件；估值、清算优先权、对赌与回购这三条，
      请律师逐字读，这笔钱不要省——所有法律与税务表述均以当年当地口径与专业意见为准。
    </p>
  </div>
</template>

<style scoped>
.sb-term-sheet-anatomy-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 14px;
}

.sb-term-sheet-anatomy-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-term-sheet-anatomy-key i {
  width: 13px;
  height: 11px;
  border-radius: 3px;
  border: 1px solid var(--accent);
  background: var(--accent-soft);
}

.sb-term-sheet-anatomy-key.is-bite i {
  border-color: var(--coral);
  background: var(--coral-soft);
}

.sb-term-sheet-anatomy-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sb-term-sheet-anatomy-card {
  min-width: 0;
  padding: 13px 14px 14px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--panel);
  box-shadow: var(--shadow);
  transition: transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
}

.sb-term-sheet-anatomy-card.is-bite {
  border-left-color: var(--coral);
  background: var(--coral-soft);
}

.sb-term-sheet-anatomy-top {
  display: grid;
  gap: 2px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--line-strong);
}

.sb-term-sheet-anatomy-en {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.sb-term-sheet-anatomy-zh {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-term-sheet-anatomy-sev {
  justify-self: start;
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.1em;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  color: var(--accent);
  background: var(--panel);
}

.sb-term-sheet-anatomy-card.is-bite .sb-term-sheet-anatomy-sev {
  border-color: var(--coral);
  color: var(--coral);
}

.sb-term-sheet-anatomy-dl {
  margin: 0;
  display: grid;
  gap: 9px;
}

.sb-term-sheet-anatomy-line {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
}

.sb-term-sheet-anatomy-line dt {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-term-sheet-anatomy-line dd {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.68;
  color: var(--ink-2);
}

.sb-term-sheet-anatomy-card.is-bite .sb-term-sheet-anatomy-line dd {
  color: var(--ink);
}

@media (max-width: 760px) {
  .sb-term-sheet-anatomy-legend {
    display: none;
  }

  .sb-term-sheet-anatomy-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-term-sheet-anatomy-card {
    transform: none;
  }

  .sb-term-sheet-anatomy-line dd {
    font-size: 12.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-term-sheet-anatomy-card {
    transition: none;
  }
}
</style>
