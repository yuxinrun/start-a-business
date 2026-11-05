<script setup lang="ts">
type Leaf = 'self' | 'loan' | 'investor'

interface Branch {
  key: string
  to: string
  leaf?: Leaf
  next?: boolean
}

interface Question {
  ask: string
  why: string
  branches: Branch[]
}

interface LeafCard {
  tone: Leaf
  no: string
  name: string
  do: string
  runway: string
  note: string
}

// 决策树是"读"的，不是"点"的：四个岔口、三条出路，路径写在图上，结论写在句子里。
const QUESTIONS: Question[] = [
  {
    ask: '这件事非花外部的钱不可吗？',
    why: '判断标准不是"能不能做大"，而是"多投一块钱，下一块钱是不是更容易赚"。规模效应、网络效应才算，靠人手堆出来的增长不算。',
    branches: [
      { key: '不需要', to: '好生意，不一定是大生意', leaf: 'self' },
      { key: '需要', to: '继续往下问', next: true }
    ]
  },
  {
    ask: '你能接受自己手里还剩多少？',
    why: '稀释不是扣一个数字，是换一份话语权。签约之前先写死一条线：低于多少我就不签。',
    branches: [
      { key: '说不清', to: '现在融资只会签你看不懂的字', leaf: 'self' },
      { key: '有底线', to: '继续往下问', next: true }
    ]
  },
  {
    ask: '手上有没有可验证的增长数据？',
    why: '要的是连续几个月、口径一致、别人复核能对上的数。一条画在 PPT 上的上升曲线不算数据。',
    branches: [
      { key: '没有', to: '先用自己的钱把它跑出来', leaf: 'loan' },
      { key: '有', to: '继续往下问', next: true }
    ]
  },
  {
    ask: '钱附带的条件，你履行得了吗？',
    why: '回购、对赌、返投、竞业、董事会席位——这些都长在"钱"这个数字之外。',
    branches: [
      { key: '履行不了', to: '这笔钱比利息贵', leaf: 'loan' },
      { key: '履行得了', to: '可以坐下来谈', leaf: 'investor' }
    ]
  }
]

const LEAVES: LeafCard[] = [
  {
    tone: 'self',
    no: '出口一',
    name: '不建议融资',
    do: '不用见人，也不用请律师读条款。先把一单账算平，把第一批愿意付钱的客户拿到手。',
    runway: '要能自己亏 12 个月',
    note: '钱不好看就先让生意变好看，不是先把报表变好看。'
  },
  {
    tone: 'loan',
    no: '出口二',
    name: '自有资金 + 贷款',
    do: '该借的钱去借：银行经营性贷款、政府性融资担保、设备融资租赁。不卖股，就不用签卖股的条款。',
    runway: '还得上月供后还能撑 6–9 个月',
    note: '贷款是要还的，个人担保可能把公司的事接到你家里那套房上——签之前逐条问清。'
  },
  {
    tone: 'investor',
    no: '出口三',
    name: '可以见投资人',
    do: '可以谈。把"卖掉多少"和"换到什么"写在同一页纸上，一起算，不要分开算。',
    runway: '拿到钱后再留 18 个月跑道',
    note: '没有任何人能保证谈成；从第一次见面到钱到账，通常还要 4–6 个月（待核）。'
  }
]

const leafName = (tone: Leaf) => LEAVES.find((l) => l.tone === tone)?.name ?? ''
</script>

<template>
  <div class="sb-fund-decision-tree sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Fund or Not · 该不该去融资</span>
      <p class="sb-widget-sub">四个问题问完，答案通常自己就出来了——而且常常是"先别融"。</p>
    </div>

    <div class="sb-fund-decision-tree-legend" aria-hidden="true">
      <span class="sb-fund-decision-tree-key is-self">自己出钱</span>
      <span class="sb-fund-decision-tree-key is-loan">借钱，不卖股</span>
      <span class="sb-fund-decision-tree-key is-investor">卖股，连条款一起进来</span>
    </div>

    <div class="sb-fund-decision-tree-flow">
      <div v-for="(q, i) in QUESTIONS" :key="q.ask" class="sb-fund-decision-tree-node">
        <span class="sb-fund-decision-tree-idx">Q{{ i + 1 }}</span>
        <div class="sb-fund-decision-tree-body">
          <p class="sb-fund-decision-tree-ask">{{ q.ask }}</p>
          <p class="sb-fund-decision-tree-why">{{ q.why }}</p>
          <ul class="sb-fund-decision-tree-branches">
            <li
              v-for="b in q.branches"
              :key="b.key"
              class="sb-fund-decision-tree-branch"
              :class="b.leaf ? ['is-leaf', 'is-' + b.leaf] : 'is-next'"
            >
              <span class="sb-fund-decision-tree-bkey">{{ b.key }}</span>
              <span class="sb-fund-decision-tree-arrow" aria-hidden="true">→</span>
              <span class="sb-fund-decision-tree-to">{{ b.to }}</span>
              <span v-if="b.leaf" class="sb-fund-decision-tree-jump">{{ leafName(b.leaf) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="sb-fund-decision-tree-leaves">
      <figure v-for="l in LEAVES" :key="l.tone" class="sb-fund-decision-tree-leaf" :class="'is-' + l.tone">
        <figcaption>
          <span class="sb-fund-decision-tree-no">{{ l.no }}</span>
          <span class="sb-fund-decision-tree-name">{{ l.name }}</span>
        </figcaption>
        <p class="sb-fund-decision-tree-do">{{ l.do }}</p>
        <p class="sb-fund-decision-tree-runway">
          <span class="sb-fund-decision-tree-run-label">跑道要求</span>
          <b>{{ l.runway }}</b>
        </p>
        <p class="sb-fund-decision-tree-note">{{ l.note }}</p>
      </figure>
    </div>

    <span class="sr-only">
      四个岔口依次是：第一，这件事需不需要外部的钱，答案是"不需要"就直接走到出口一"不建议融资"；
      第二，你能接受自己手里还剩多少股份，答"说不清"也走到出口一；第三，手上有没有可验证的增长数据，
      答"没有"走到出口二"自有资金加贷款"；第四，钱附带的条件你履行不履行得了，答"履行不了"同样走到出口二，
      答"履行得了"才走到出口三"可以见投资人"。三个出口要求的现金跑道分别是：出口一约
      12 个月，也就是要能自己亏 12 个月；出口二是在还得上月供之后还能撑 6 到 9 个月；
      出口三是拿到钱之后再留 18 个月跑道，而且从第一次见面到钱到账通常还要 4 到 6 个月。
      以上月数都是经验口径，属于待核数字，不是任何机构的承诺。
    </span>

    <p class="sb-cap">
      四个问题走下来，多数人的落点是<b>出口一或出口二</b>：先把一单账算平、先借不用卖股的钱。
      真要见投资人，也请记住这两句——谈判桌上没有"保证谈成"，只有<b>跑道够不够长</b>：
      从见面到打款一般要 <b>4–6 个月</b>（待核），这期间你仍在烧自己的钱；
      拿到钱后按投资人口径留 <b>18 个月</b> 跑道（待核）。涉及条款与担保的部分，
      以当年当地口径与专业意见为准。
    </p>
  </div>
</template>

<style scoped>
.sb-fund-decision-tree-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 14px;
}

.sb-fund-decision-tree-key {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
  padding-left: 12px;
  position: relative;
}

.sb-fund-decision-tree-key::before {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.sb-fund-decision-tree-key.is-self::before {
  background: var(--accent);
}

.sb-fund-decision-tree-key.is-loan::before {
  background: var(--blue);
}

.sb-fund-decision-tree-key.is-investor::before {
  background: var(--coral);
}

/* 一条虚线主干 + 挂在上面的岔口，窄屏时只是变窄，不会横向溢出 */
.sb-fund-decision-tree-flow {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 14px;
  border-left: 1px dashed var(--line-strong);
}

.sb-fund-decision-tree-node {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-fund-decision-tree-idx {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.sb-fund-decision-tree-body {
  min-width: 0;
}

.sb-fund-decision-tree-ask {
  margin: 0 0 4px;
  font-size: 13.5px;
  font-weight: 680;
  line-height: 1.45;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-fund-decision-tree-why {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-fund-decision-tree-branches {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-fund-decision-tree-branch {
  display: grid;
  grid-template-columns: minmax(58px, auto) 14px minmax(0, 1fr);
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  line-height: 1.5;
}

.sb-fund-decision-tree-bkey {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--line-strong);
  background: var(--panel);
  color: var(--ink-2);
  white-space: nowrap;
}

.sb-fund-decision-tree-arrow {
  font-family: var(--font-mono);
  color: var(--faint);
}

.sb-fund-decision-tree-to {
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-fund-decision-tree-jump {
  grid-column: 1 / -1;
  justify-self: start;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
  transition: transform 0.3s var(--ease);
}

.sb-fund-decision-tree-branch.is-next .sb-fund-decision-tree-to {
  color: var(--faint);
}

.sb-fund-decision-tree-branch.is-loan .sb-fund-decision-tree-jump {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-soft);
}

.sb-fund-decision-tree-branch.is-investor .sb-fund-decision-tree-jump {
  border-color: var(--coral);
  color: var(--coral);
  background: var(--coral-soft);
}

.sb-fund-decision-tree-leaves {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.sb-fund-decision-tree-leaf {
  margin: 0;
  padding: 12px 13px;
  border: 1px solid var(--line);
  border-top: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--panel);
  box-shadow: var(--shadow);
  min-width: 0;
}

.sb-fund-decision-tree-leaf.is-loan {
  border-top-color: var(--blue);
}

.sb-fund-decision-tree-leaf.is-investor {
  border-top-color: var(--coral);
}

.sb-fund-decision-tree-leaf figcaption {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

.sb-fund-decision-tree-no {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-fund-decision-tree-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-fund-decision-tree-do {
  margin: 0 0 8px;
  font-size: 11.5px;
  line-height: 1.62;
  color: var(--ink-2);
}

.sb-fund-decision-tree-runway {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2px;
  margin: 0 0 8px;
  padding: 7px 9px;
  border-radius: 8px;
  background: var(--panel-2);
  border: 1px dashed var(--line-strong);
}

.sb-fund-decision-tree-run-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-fund-decision-tree-runway b {
  font-size: 12px;
  color: var(--accent);
  overflow-wrap: anywhere;
}

.sb-fund-decision-tree-leaf.is-loan .sb-fund-decision-tree-runway b {
  color: var(--blue);
}

.sb-fund-decision-tree-leaf.is-investor .sb-fund-decision-tree-runway b {
  color: var(--coral);
}

.sb-fund-decision-tree-note {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.6;
  color: var(--muted);
}

@media (max-width: 760px) {
  .sb-fund-decision-tree-legend {
    display: none;
  }

  .sb-fund-decision-tree-node {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }

  .sb-fund-decision-tree-leaves {
    grid-template-columns: minmax(0, 1fr);
  }

  .sb-fund-decision-tree-flow {
    padding-left: 10px;
  }

  .sb-fund-decision-tree-branch {
    grid-template-columns: minmax(0, 1fr);
    gap: 3px;
  }

  .sb-fund-decision-tree-arrow {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-fund-decision-tree-jump {
    transition: none;
  }
}
</style>
