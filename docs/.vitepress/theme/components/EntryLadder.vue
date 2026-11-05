<script setup lang="ts">
interface Rung {
  level: number
  name: string
  risk: number
  control: number
  money: string
  pace: string
  when: string
  catch: string
  rise: number
}

// 草稿口径（待核）：三档投入是「常见量级」，不是任何品牌的报价；风险与可控度是 1–3 档的相对打分。
const RUNGS: Rung[] = [
  {
    level: 1,
    name: '副业试水',
    risk: 1,
    control: 2,
    money: '约 0.5–2 万元',
    pace: '慢：一周只有晚上和周末',
    when: '还在上班，且这笔钱全亏掉也不影响家里吃饭的时候。',
    catch: '上限低：一个人最多就这么点时间，做到一定规模必须做选择。',
    rise: 24
  },
  {
    level: 2,
    name: '加盟',
    risk: 2,
    control: 1,
    money: '约 8–30 万元（含加盟费与首批物料）',
    pace: '快：流程、招牌、供货都现成',
    when: '只想买一套跑通过的流程，而且能把合同逐条读完再签字的时候。',
    catch: '合同决定一切：加盟费只是开始，真正花钱的往往是物料强制采购与区域保护条款（以合同与当年口径为准）。',
    rise: 58
  },
  {
    level: 3,
    name: '自创品牌',
    risk: 3,
    control: 3,
    money: '约 15–60 万元',
    pace: '最慢：每一步都要自己试错',
    when: '已经在这行摸到过客户、知道自己哪一步会被卡住的时候。',
    catch: '慢是代价也是护城河：走通过的路径归你，踩过的坑也归你。',
    rise: 92
  }
]

const MAX_LEVEL = 3
</script>

<template>
  <div class="sb-entry-ladder sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Entry Ladder · 先进场三种走法</span>
      <p class="sb-widget-sub">台阶越高，钱和风险越大——但「可控度」并不是跟着一起涨的。</p>
    </div>

    <ol class="sb-entry-ladder-steps">
      <li v-for="rung in RUNGS" :key="rung.name" class="sb-entry-ladder-rung">
        <div class="sb-entry-ladder-body">
          <div class="sb-entry-ladder-top">
            <span class="sb-entry-ladder-index">{{ '0' + rung.level }}</span>
            <span class="sb-entry-ladder-name">{{ rung.name }}</span>
          </div>

          <div class="sb-entry-ladder-meters">
            <div class="sb-entry-ladder-meter">
              <span class="sb-entry-ladder-mlabel">风险</span>
              <span class="sb-entry-ladder-track">
                <i
                  v-for="n in MAX_LEVEL"
                  :key="'r' + n"
                  class="sb-entry-ladder-cell is-risk"
                  :class="{ 'is-on': n <= rung.risk }"
                ></i>
              </span>
              <span class="sb-entry-ladder-mval">{{ rung.risk }} / {{ MAX_LEVEL }}</span>
            </div>
            <div class="sb-entry-ladder-meter">
              <span class="sb-entry-ladder-mlabel">可控度</span>
              <span class="sb-entry-ladder-track">
                <i
                  v-for="n in MAX_LEVEL"
                  :key="'c' + n"
                  class="sb-entry-ladder-cell is-keep"
                  :class="{ 'is-on': n <= rung.control }"
                ></i>
              </span>
              <span class="sb-entry-ladder-mval">{{ rung.control }} / {{ MAX_LEVEL }}</span>
            </div>
          </div>

          <p class="sb-entry-ladder-line is-money">先期投入：{{ rung.money }}</p>
          <p class="sb-entry-ladder-line">{{ rung.pace }}</p>
          <p class="sb-entry-ladder-when">什么时候选它：{{ rung.when }}</p>
          <p class="sb-entry-ladder-catch">{{ rung.catch }}</p>
        </div>
        <span class="sb-entry-ladder-riser" aria-hidden="true" :style="{ height: rung.rise + 'px' }"></span>
      </li>
    </ol>

    <span class="sr-only">
      三级台阶，风险和可控度都是 1 到 3 档的相对打分，投入是示意量级、待核。
      第一级副业试水：风险 1 档，可控度 2 档，先期投入约 0.5 万到 2 万元，慢在一周只有晚上和周末，
      上限低；什么时候选它——还在上班、这笔钱全亏掉也不影响家里吃饭。
      第二级加盟：风险 2 档，可控度 1 档，约 8 万到 30 万元（含加盟费与首批物料），
      流程和供货现成所以快；合同决定一切，加盟费只是开始，真正花钱的往往是物料强制采购与区域保护条款；
      什么时候选它——只想买一套跑通过的流程，且能把合同逐条读完再签字。
      第三级自创品牌：风险 3 档，可控度 3 档，约 15 万到 60 万元，最慢，
      但走通的路径和踩过的坑都归你；什么时候选它——已经在这行摸到过客户、知道自己哪一步会被卡住。
      涉及合同、税务与社保的具体口径以当地当年规定为准。
    </span>

    <p class="sb-cap">
      三档的账是这样的：副业试水 <b>约 0.5–2 万元</b> 就能开，风险最低但可控度只有
      <b>2/3</b>；加盟要 <b>约 8–30 万元</b>，看着最省心，可控度反而是三档里最低的
      <b>1/3</b>——合同决定一切；自创品牌 <b>约 15–60 万元</b>、最慢，但可控度
      <b>3/3</b>。所以别问「哪条最安全」，问自己手里有几万块、能不能等、读不读得懂合同（费率与条款以当地当年口径为准）。
    </p>
  </div>
</template>

<style scoped>
.sb-entry-ladder-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  /* 底边对齐：越靠右的台阶越高，靠的是下面那段「台阶面」变厚 */
  align-items: end;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-entry-ladder-rung {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sb-entry-ladder-body {
  min-width: 0;
  margin-bottom: 8px;
  padding: 12px 12px 10px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-entry-ladder-riser {
  display: block;
  align-self: stretch;
  border: 1px dashed var(--line-strong);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  background: var(--panel-3);
}

.sb-entry-ladder-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
}

.sb-entry-ladder-index {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--faint);
}

.sb-entry-ladder-name {
  font-size: 14px;
  font-weight: 680;
  color: var(--ink);
}

.sb-entry-ladder-meters {
  display: grid;
  gap: 6px;
  margin-bottom: 10px;
}

/* 打分格放进 minmax(0,1fr) 轨道，标签各占自己的列，窄屏不抢宽度 */
.sb-entry-ladder-meter {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) 34px;
  align-items: center;
  column-gap: 8px;
}

.sb-entry-ladder-mlabel {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.sb-entry-ladder-track {
  display: flex;
  min-width: 0;
  gap: 3px;
}

.sb-entry-ladder-cell {
  flex: 1 1 0;
  min-width: 0;
  height: 9px;
  border-radius: 3px;
  border: 1px solid var(--line-strong);
  background: transparent;
  transition: background-color 0.3s var(--ease);
}

.sb-entry-ladder-cell.is-risk.is-on {
  border-color: var(--coral);
  background: var(--coral);
  opacity: 0.85;
}

.sb-entry-ladder-cell.is-keep.is-on {
  border-color: var(--accent);
  background: var(--accent);
  opacity: 0.85;
}

.sb-entry-ladder-mval {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  text-align: right;
  color: var(--ink-2);
  white-space: nowrap;
}

.sb-entry-ladder-line {
  margin: 0 0 5px;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-entry-ladder-line.is-money {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--ink-2);
}

.sb-entry-ladder-when {
  margin: 8px 0 5px;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink);
}

.sb-entry-ladder-catch {
  margin: 0;
  padding-top: 7px;
  border-top: 1px dashed var(--line-strong);
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

@media (max-width: 760px) {
  /* 窄屏换成纵列台阶：台阶从「往右上」变成「往下走」 */
  .sb-entry-ladder-steps {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-entry-ladder-riser {
    order: -1;
    /* 行内样式给的是台阶高度，窄屏只保留一条连接线：max-height 压过 height */
    max-height: 10px;
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-sm);
  }

  .sb-entry-ladder-rung:first-child .sb-entry-ladder-riser {
    display: none;
  }

  .sb-entry-ladder-body {
    margin-bottom: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-entry-ladder-cell {
    transition: none;
  }
}
</style>
