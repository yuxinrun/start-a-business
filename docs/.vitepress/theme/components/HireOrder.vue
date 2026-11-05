<script setup lang="ts">
interface Step {
  order: string
  role: string
  signal: string
  does: string
  mistake: string
}

interface Channel {
  name: string
  quality: number
  speed: number
  cost: number
  use: string
  caveat: string
}

// 顺序按"钱从哪来"排，不按"谁最省事"排。评分是通行口径的示意（待核），不是任何一家平台的实测。
const STEPS: Step[] = [
  {
    order: '第 1 个',
    role: '能自己交付的人',
    signal: '你因为自己在干活，已经接不下新单；交付开始拖到客户来催。',
    does: '把活干完，而且不用你站在旁边看着。他要能独立收尾，你要能出门。',
    mistake: '招一个"帮你打杂"的人，把自己继续留在唯一会干活的岗位上——公司的大小就还是你的清醒时间。'
  },
  {
    order: '第 2 个',
    role: '能自己带来客户的人',
    signal: '交付稳了，但每一单都要靠你刷脸；你一生病，收入就停。',
    does: '把"老板认识人"变成"公司有人负责找下一单"。销售不必是头衔，可以是敢敲门的人。',
    mistake: '先招了行政、前台、助理，把公司变成一个只处理内部事务的地方，客户还是只有你认识。'
  },
  {
    order: '第 3 个',
    role: '把流程写下来的人',
    signal: '同一类错误第二次出现；新人上手全靠你在群里一句一句回。',
    does: '报价、验收、回访各写成 1 页纸：谁做、什么时候做、做到什么标准、记录在哪。',
    mistake: '用"我说过了"当沟通机制。说过不等于可复制，只有写下来才交接得动。'
  },
  {
    order: '再往后',
    role: '行政、财务、人事这类共享职能',
    signal: '单据量和工资单的量，真的超过了兼职或外包能处理的范围。',
    does: '先用外包、兼职或共享服务，量到了再设全职岗。一个人管三家公司的账，比一家养一个人便宜。',
    mistake: '为了"看起来正规"提前设岗。固定成本一旦上了账，就要靠你每个月替它找理由。'
  }
]

const CHANNELS: Channel[] = [
  {
    name: '熟人推荐',
    quality: 4,
    speed: 4,
    cost: 1,
    use: '前 3 个人，尤其第 1 个能自己交付的。',
    caveat: '便宜且快，但样本全是"你朋友那一圈"，别把介绍人的口碑当成能力证明。'
  },
  {
    name: '垂直社区与同行群',
    quality: 4,
    speed: 3,
    cost: 2,
    use: '需要行业手感的人：师傅、店长、垂类销售。',
    caveat: '人就在行里，判断成本低；但他们同时也在被同行挖，谈钱要坦率。'
  },
  {
    name: '招聘平台',
    quality: 3,
    speed: 3,
    cost: 3,
    use: '标准化岗位：会计、客服、设计、行政。',
    caveat: '简历量大、水分也大，前期筛选花时间。这些时间是你的成本，别忽略。'
  },
  {
    name: '猎头',
    quality: 5,
    speed: 2,
    cost: 5,
    use: '只有一个岗位错了会要命时：技术负责人、销售负责人。',
    caveat: '按年薪百分比收费（待核，各地各档差别大），且交付节奏不在你手里。'
  }
]

const MAX_SCORE = 5
const pct = (n: number) => (n / MAX_SCORE) * 100
</script>

<template>
  <div class="sb-hire-order sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Hiring Order · 第一个该招谁</span>
      <p class="sb-widget-sub">招人顺序错了，钱会先花在最不解决问题的岗位上。顺手看一下四条渠道。</p>
    </div>

    <ol class="sb-hire-order-line">
      <li v-for="s in STEPS" :key="s.role" class="sb-hire-order-step">
        <span class="sb-hire-order-dot" aria-hidden="true"></span>
        <p class="sb-hire-order-order">{{ s.order }}</p>
        <p class="sb-hire-order-role">{{ s.role }}</p>
        <dl class="sb-hire-order-detail">
          <div class="sb-hire-order-pair">
            <dt>该招的信号</dt>
            <dd>{{ s.signal }}</dd>
          </div>
          <div class="sb-hire-order-pair">
            <dt>他负责什么</dt>
            <dd>{{ s.does }}</dd>
          </div>
          <div class="sb-hire-order-pair is-warn">
            <dt>最常见的错</dt>
            <dd>{{ s.mistake }}</dd>
          </div>
        </dl>
      </li>
    </ol>

    <p class="sb-hire-order-sub-title">四条渠道，各自快在哪、贵在哪</p>
    <div class="sb-hire-order-legend" aria-hidden="true">
      <span class="sb-hire-order-key"><i class="is-q"></i>质量（高=好）</span>
      <span class="sb-hire-order-key"><i class="is-s"></i>速度（高=到岗快）</span>
      <span class="sb-hire-order-key"><i class="is-c"></i>花费（高=贵）</span>
    </div>

    <div class="sb-hire-order-chans">
      <div v-for="c in CHANNELS" :key="c.name" class="sb-hire-order-chan">
        <div class="sb-hire-order-chan-meta">
          <p class="sb-hire-order-chan-name">{{ c.name }}</p>
          <p class="sb-hire-order-chan-use">{{ c.use }}</p>
          <p class="sb-hire-order-chan-caveat">{{ c.caveat }}</p>
        </div>
        <div class="sb-hire-order-scores">
          <p class="sb-hire-order-score">
            <span class="sb-hire-order-score-label">质量</span>
            <span class="sb-hire-order-track">
              <span class="sb-hire-order-fill is-q" :style="{ width: pct(c.quality) + '%' }"></span>
            </span>
            <span class="sb-hire-order-num">{{ c.quality }}</span>
          </p>
          <p class="sb-hire-order-score">
            <span class="sb-hire-order-score-label">速度</span>
            <span class="sb-hire-order-track">
              <span class="sb-hire-order-fill is-s" :style="{ width: pct(c.speed) + '%' }"></span>
            </span>
            <span class="sb-hire-order-num">{{ c.speed }}</span>
          </p>
          <p class="sb-hire-order-score">
            <span class="sb-hire-order-score-label">花费</span>
            <span class="sb-hire-order-track">
              <span class="sb-hire-order-fill is-c" :style="{ width: pct(c.cost) + '%' }"></span>
            </span>
            <span class="sb-hire-order-num">{{ c.cost }}</span>
          </p>
        </div>
      </div>
    </div>

    <span class="sr-only">
      招聘顺序四步：第 1 个是能自己交付的人，第 2 个是能自己带来客户的人，第 3 个是把流程写下来的人，
      再往后才是行政、财务、人事这类共享职能。渠道评分各按质量、速度、花费三项打分，满分 5 分：
      熟人推荐 质量 4 分、速度 4 分、花费 1 分；垂直社区与同行群 质量 4 分、速度 3 分、花费 2 分；
      招聘平台 质量 3 分、速度 3 分、花费 3 分；猎头 质量 5 分、速度 2 分、花费 5 分。
      花费分越高代表越贵。评分为通行口径的示意，待核，且本站不承诺任何到岗时间。
    </span>

    <p class="sb-cap">
      顺序只有一条主线：<b>先让人替你干活，再让人替你找活，最后才让人替你写规则</b>——第 4 步的共享职能
      用外包或兼职就够，别提前设全职岗。四条渠道里 <b>熟人推荐</b> 质量 4 分、花费 1 分最划算，
      <b>猎头</b> 质量 5 分但花费也 5 分，只留给"错一个人就要命"的那个岗位。到岗时间不承诺，
      背景核对只查与岗位直接相关的合法项，与工作无关的隐私不要打听。评分口径为示意，<b>待核</b>。
    </p>
  </div>
</template>

<style scoped>
.sb-hire-order-line {
  position: relative;
  margin: 0 0 8px;
  padding: 0 0 0 22px;
  list-style: none;
}

/* 时间线的竖线用伪元素画，窄屏不用换布局也不会断 */
.sb-hire-order-line::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 8px;
  bottom: 10px;
  width: 1px;
  background: var(--line-strong);
}

.sb-hire-order-step {
  position: relative;
  padding: 0 0 18px;
}

.sb-hire-order-step:last-child {
  padding-bottom: 4px;
}

.sb-hire-order-dot {
  position: absolute;
  left: -21px;
  top: 6px;
  width: 11px;
  height: 11px;
  border: 2px solid var(--accent);
  border-radius: 999px;
  background: var(--panel);
}

.sb-hire-order-step:last-child .sb-hire-order-dot {
  border-color: var(--coral);
}

.sb-hire-order-order {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--accent);
}

.sb-hire-order-role {
  margin: 3px 0 8px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.sb-hire-order-detail {
  margin: 0;
  display: grid;
  gap: 6px;
}

.sb-hire-order-pair {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 10px;
  align-items: baseline;
}

.sb-hire-order-pair dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-hire-order-pair dd {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink-2);
}

.sb-hire-order-pair.is-warn dt {
  color: var(--coral);
}

.sb-hire-order-sub-title {
  margin: 18px 0 4px;
  padding-top: 16px;
  border-top: 1px dashed var(--line-strong);
  font-size: 13px;
  font-weight: 660;
  color: var(--ink);
}

.sb-hire-order-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-bottom: 8px;
}

.sb-hire-order-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-hire-order-key i {
  width: 13px;
  height: 8px;
  border-radius: 2px;
}

.sb-hire-order-key i.is-q {
  background: var(--accent);
}

.sb-hire-order-key i.is-s {
  background: var(--blue);
}

.sb-hire-order-key i.is-c {
  background: var(--coral);
}

.sb-hire-order-chan {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 14px;
  padding: 13px 0;
  border-top: 1px solid var(--line);
}

.sb-hire-order-chan-meta {
  min-width: 0;
}

.sb-hire-order-chan-name {
  margin: 0 0 3px;
  font-size: 14px;
  font-weight: 660;
  color: var(--ink);
}

.sb-hire-order-chan-use {
  margin: 0 0 4px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--ink-2);
}

.sb-hire-order-chan-caveat {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.55;
  color: var(--muted);
}

.sb-hire-order-scores {
  min-width: 0;
  display: grid;
  gap: 7px;
}

/* 条形落在自己的网格列里，数值单独一列：窄屏不会溢出 */
.sb-hire-order-score {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr) 22px;
  align-items: center;
  gap: 7px;
  margin: 0;
}

.sb-hire-order-score-label {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-hire-order-track {
  display: block;
  min-width: 0;
  height: 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
}

.sb-hire-order-fill {
  display: block;
  height: 100%;
  transition: width 0.3s var(--ease);
}

.sb-hire-order-fill.is-q {
  background: var(--accent);
}

.sb-hire-order-fill.is-s {
  background: var(--blue);
}

.sb-hire-order-fill.is-c {
  background: var(--coral);
}

.sb-hire-order-num {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: right;
}

@media (max-width: 760px) {
  .sb-hire-order-chan {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-hire-order-pair {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .sb-hire-order-legend {
    display: none;
  }

  .sb-hire-order-line {
    padding-left: 18px;
  }

  .sb-hire-order-dot {
    left: -17px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-hire-order-fill {
    transition: none;
  }
}
</style>
