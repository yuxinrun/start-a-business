<script setup lang="ts">
import { computed, ref } from 'vue'

type Severity = '无害' | '误导' | '有害'

interface Myth {
  claim: string
  truth: string
  severity: Severity
  /** 色条走 ASCII 键，避免中文类名进 CSS 选择器 */
  sev: 'none' | 'mislead' | 'danger'
  source: string
}

// 14 条说法按流传频次挑，真相以事实库（.qoder/factbase.md）为准；标"待核"的口径尚未复核。
const MYTHS: Myth[] = [
  {
    claim: '创业就是当老板，不用再上班了。',
    truth: '你只是把一份工作换成了四份：销售、交付、算账、招人，而且没有下班。真正多出来的不是自由，是没人替你兜底的决定。',
    severity: '无害',
    sev: 'none',
    source: '第一天就会被现实纠正；本站「适不适合现在做」把这四个岗位拆开算过时间。'
  },
  {
    claim: '90% 的创业公司都会失败。',
    truth: '这个数字到处被引用，却很少有人给出统计口径：什么叫创业公司、几年内、算不算注销。听着科学，其实是句没法核对的话。',
    severity: '误导',
    sev: 'mislead',
    source: '待核：未找到可复核的统一口径。本站不引用具体失败率，只讲哪些死法可以避免。'
  },
  {
    claim: '第一年必须 all-in，辞职才显得有决心。',
    truth: '决心不能当饭吃。先用自己的业余时间收到第一笔不属于熟人的钱，再换身份，顺序反过来时代价最大——因为你同时丢了收入和试错空间。',
    severity: '有害',
    sev: 'danger',
    source: '参见「启动资金：亏多少会伤到你」与「切入方式：副业、加盟、自创品牌」。'
  },
  {
    claim: '要先把商业计划书写完，再开始做。',
    truth: '计划书写完的那天，你对市场的想象就变成了对文档的义务。有效顺序是：先做一次能收到钱的小动作，再把结论写成别人能接手的文档。',
    severity: '误导',
    sev: 'mislead',
    source: '《精益创业》的可操作部分是"先写下可否证的假设"，不是"先写长文档"。'
  },
  {
    claim: '风口比能力重要，选对行业就赢了一半。',
    truth: '风口决定的是"进场时有多挤"，不是"你能不能活"。同一个赛道里，算得清一单账的人活得久，追热点的人换赛道换得比换手机还勤。',
    severity: '有害',
    sev: 'danger',
    source: '参见「选行业的三步」「红海、蓝海与「看起来很赚钱」」。'
  },
  {
    claim: '拿到投资就安全了。',
    truth: '钱进来之后，你的客户多了一个：投资人。账上的钱换成了里程碑、报表和下一轮的压力；条款里还有回购与对赌。安全感的错觉本身就是一种风险。',
    severity: '有害',
    sev: 'danger',
    source: '参见「条款清单：估值之外真正要紧的东西」「人民币基金、对赌与实缴」。'
  },
  {
    claim: '股权五五分最公平。',
    truth: '平分回避了真正的对话：谁出资、谁全职、谁带客户、离开时怎么算。等到有人要走的那天，五五分才发现谁都不肯让步——因为没人提前写过规则。',
    severity: '有害',
    sev: 'danger',
    source: '参见「股权分配：分多少、怎么兑现」「开张前先谈好怎么散伙」。'
  },
  {
    claim: '有补贴就等于有收入。',
    truth: '补贴是条件、是账期、也是随时会变的口径；收入是客户愿意重复付的钱。把补贴写进主营收入做预算，补贴退坡那天就变成现金缺口。',
    severity: '有害',
    sev: 'danger',
    source: '待核：各地补贴口径不同。参见「现金流：利润是观点，现金是事实」。'
  },
  {
    claim: '先做个 App，再谈生意。',
    truth: '产品是把假设做成能收钱的东西，不是把想法做成截图。先确认有人愿意为这个问题付钱，再决定要不要写代码——多数时候答案是先服务，不开发。',
    severity: '误导',
    sev: 'mislead',
    source: '参见「一单的账：贡献毛利」与书单页《The Mom Test》的可执行动作。'
  },
  {
    claim: '价格低就能打赢对手。',
    truth: '降价是花真金白银买转化率：毛利损失立刻到账，销量提升迟迟不来。你能降，对手也能降，而且他可能比你更能亏。',
    severity: '有害',
    sev: 'danger',
    source: '参见「定价：贵不是问题」。低价策略的前提是成本结构真的更低，不是"我愿意少赚"。'
  },
  {
    claim: '招人太贵，所以先用兼职和实习生。',
    truth: '省下的工资常常变成返工、交接和重新招人。核心交付岗用便宜的人，等于把自己变成最贵的那个环节——因为你得一直盯着。',
    severity: '误导',
    sev: 'mislead',
    source: '参见「招人：第一个该招的是谁」「待遇：薪酬与社保的真实成本」。用工形式还涉及合规，见「劳动法红线」。'
  },
  {
    claim: '营收在涨，就是在赚钱。',
    truth: '涨的收入如果账期长、要备货，就是先把钱垫出去。很多死掉的公司死前营收曲线都很好看——它们缺的是现金，不是订单。',
    severity: '有害',
    sev: 'danger',
    source: '《鞋狗》里最硬的一课是应收账款；本站把它拆在「现金流」与「第一年真实的账」两页。'
  },
  {
    claim: '老板最懂，所以不用授权。',
    truth: '公司的大小就等于你清醒的小时数。不授权不是效率高，是你把瓶颈焊死在自己身上，而且没有第二个人知道事情是怎么做成的。',
    severity: '误导',
    sev: 'mislead',
    source: '参见「组织架构：人多了怎么分组」「把公司变成机器：流程与授权」。'
  },
  {
    claim: '飞轮一旦转起来就不用管了。',
    truth: '飞轮不自己转，每一环都要有人推。交付质量一掉、现金一断，轮子就停，而且停得比转起来快得多。',
    severity: '误导',
    sev: 'mislead',
    source: '参见「飞轮：让增长自己转起来」——图上明写两个打断点。'
  }
]

// 服务端与首帧一律全闭合，翻转只在点击后发生。
const open = ref<boolean[]>(MYTHS.map(() => false))

const toggle = (i: number) => {
  open.value[i] = !open.value[i]
}

const allOpen = computed(() => open.value.every(Boolean))

function toggleAll() {
  const next = !allOpen.value
  open.value = MYTHS.map(() => next)
}

const counts = computed(() => {
  const c: Record<Severity, number> = { 无害: 0, 误导: 0, 有害: 0 }
  for (const m of MYTHS) c[m.severity] += 1
  return c
})

const openedCount = computed(() => open.value.filter(Boolean).length)
</script>

<template>
  <div class="sb-myth-flip sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Myth Flip · 说法翻过来看</span>
      <p class="sb-widget-sub">14 条最常听到的话。卡片正面是说法，点开才是它经不经得起追问。</p>
    </div>

    <div class="sb-myth-flip-bar-legend" aria-hidden="true">
      <span class="sb-myth-flip-key"><i class="is-0"></i>无害：现实会纠正</span>
      <span class="sb-myth-flip-key"><i class="is-1"></i>误导：绕了远路</span>
      <span class="sb-myth-flip-key"><i class="is-2"></i>有害：会亏掉真钱</span>
      <button type="button" class="sb-myth-flip-all" @click="toggleAll">
        {{ allOpen ? '全部合上' : '全部翻开' }}
      </button>
    </div>

    <ul class="sb-myth-flip-grid">
      <li v-for="(m, i) in MYTHS" :key="m.claim">
        <button
          type="button"
          class="sb-myth-flip-card"
          :class="['is-' + m.sev, { 'is-open': open[i] }]"
          :aria-expanded="open[i]"
          @click="toggle(i)"
        >
          <span class="sb-myth-flip-edge" aria-hidden="true"></span>
          <span class="sb-myth-flip-no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="sb-myth-flip-tag">{{ m.severity }}</span>
          <span class="sb-myth-flip-claim">「{{ m.claim }}」</span>
          <span v-if="!open[i]" class="sb-myth-flip-hint">点开看看这句话有没有根据 →</span>
          <span v-else class="sb-myth-flip-truth">{{ m.truth }}</span>
          <span v-if="open[i]" class="sb-myth-flip-source">{{ m.source }}</span>
        </button>
      </li>
    </ul>

    <span class="sr-only">
      共 14 条流行说法，按危害程度分三档：无害 {{ counts['无害'] }} 条，误导 {{ counts['误导'] }} 条，
      有害 {{ counts['有害'] }} 条。当前已翻开 {{ openedCount }} 条。说法依次为：
      <template v-for="m in MYTHS" :key="m.claim">{{ m.claim }}（{{ m.severity }}）；</template>
    </span>

    <p class="sb-cap">
      14 条里有 <b>7 条</b> 会直接让你亏掉真钱（标「有害」），<b>6 条</b> 是绕远路，只有
      <b>1 条</b> 属于"现实第一天就会纠正你"。真正值得记住的是这一条：说法越具体、越像数字，
      越要先问 <b>口径从哪来</b>——比如 <b>90%</b> 那个失败率，没人说清统计的是哪类公司、几年之内。
      本页不引用查不到来源的数字。
    </p>
  </div>
</template>

<style scoped>
.sb-myth-flip-bar-legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 14px;
  margin-bottom: 14px;
}

.sb-myth-flip-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-myth-flip-key i {
  width: 13px;
  height: 4px;
  border-radius: 2px;
  background: var(--coral);
}

.sb-myth-flip-key i.is-0 {
  background: var(--accent);
}

.sb-myth-flip-key i.is-1 {
  background: var(--coral);
  opacity: 0.45;
}

.sb-myth-flip-key i.is-2 {
  background: var(--coral);
  opacity: 1;
}

.sb-myth-flip-all {
  margin-left: auto;
  padding: 5px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-sans);
  font-size: 11.5px;
  cursor: pointer;
  transition: border-color 0.2s var(--ease), color 0.2s var(--ease), background 0.2s var(--ease);
}

.sb-myth-flip-all:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

.sb-myth-flip-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-myth-flip-grid > li {
  min-width: 0;
}

.sb-myth-flip-card {
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  padding: 16px 16px 15px 19px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  color: var(--ink);
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), transform 0.2s var(--ease);
}

.sb-myth-flip-card:hover {
  border-color: var(--line-strong);
  background: var(--panel-3);
}

/* 严重度只改色条深浅，不引入新颜色 */
.sb-myth-flip-edge {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  border-radius: 2px;
  background: var(--coral);
}

.sb-myth-flip-card.is-none .sb-myth-flip-edge {
  background: var(--accent);
}

.sb-myth-flip-card.is-mislead .sb-myth-flip-edge {
  background: var(--coral);
  opacity: 0.45;
}

.sb-myth-flip-card.is-danger .sb-myth-flip-edge {
  background: var(--coral);
  opacity: 1;
}

.sb-myth-flip-no,
.sb-myth-flip-tag {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.sb-myth-flip-no {
  color: var(--faint);
}

.sb-myth-flip-tag {
  margin-left: 8px;
  padding: 2px 7px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  color: var(--muted);
}

.sb-myth-flip-card.is-danger .sb-myth-flip-tag {
  border-color: var(--coral);
  color: var(--coral);
}

.sb-myth-flip-card.is-none .sb-myth-flip-tag {
  border-color: var(--accent);
  color: var(--accent);
}

.sb-myth-flip-claim {
  display: block;
  margin-top: 9px;
  font-size: 14.5px;
  font-weight: 680;
  line-height: 1.55;
  color: var(--ink);
}

.sb-myth-flip-hint {
  display: block;
  margin-top: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-myth-flip-truth {
  display: block;
  margin-top: 8px;
  padding-top: 9px;
  border-top: 1px dashed var(--line-strong);
  font-size: 13px;
  line-height: 1.62;
  color: var(--ink-2);
  transform-origin: left center;
  animation: sb-myth-flip-in 0.26s var(--ease);
}

.sb-myth-flip-source {
  display: block;
  margin-top: 9px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  line-height: 1.55;
  letter-spacing: 0.02em;
  color: var(--muted);
}

@keyframes sb-myth-flip-in {
  from {
    opacity: 0;
    transform: rotateX(-38deg) translateY(-4px);
  }

  to {
    opacity: 1;
    transform: rotateX(0) translateY(0);
  }
}

@media (max-width: 760px) {
  .sb-myth-flip-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-myth-flip-card {
    padding: 14px 13px 13px 16px;
  }

  .sb-myth-flip-bar-legend {
    gap: 6px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-myth-flip-truth {
    animation: none;
  }

  .sb-myth-flip-card,
  .sb-myth-flip-all {
    transition: none;
  }
}
</style>
