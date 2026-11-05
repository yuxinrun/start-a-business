<script setup lang="ts">
// /run/flywheel 的讲解版飞轮：节点文字要能读，所以动画留白、信息优先。
// 首页那个会转的是 HeroFlywheel.vue，两个不是同一张图。

const COUNT = 5
const CX = 170
const CY = 170
const R = 100
const STEP = 360 / COUNT

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

const round = (n: number) => Math.round(n * 100) / 100

const arcPath = (r: number, from: number, to: number) => {
  const a = polar(r, from)
  const b = polar(r, to)
  return `M ${round(a.x)} ${round(a.y)} A ${r} ${r} 0 0 1 ${round(b.x)} ${round(b.y)}`
}

const headPath = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180
  const px = CX + r * Math.cos(rad)
  const py = CY + r * Math.sin(rad)
  // 切线方向 = 角度增大的方向；法线方向 = 朝环外
  const tx = -Math.sin(rad)
  const ty = Math.cos(rad)
  const nx = Math.cos(rad)
  const ny = Math.sin(rad)
  const tip = { x: px + tx * 14, y: py + ty * 14 }
  const left = { x: px - tx * 2 + nx * 7.5, y: py - ty * 2 + ny * 7.5 }
  const right = { x: px - tx * 2 - nx * 7.5, y: py - ty * 2 - ny * 7.5 }
  return `M ${round(tip.x)} ${round(tip.y)} L ${round(left.x)} ${round(left.y)} L ${round(right.x)} ${round(right.y)} Z`
}

const LINKS = Array.from({ length: COUNT }, (_, i) => {
  const from = -90 + i * STEP + 21
  const to = -90 + (i + 1) * STEP - 21
  const mid = polar(R, -90 + i * STEP + STEP / 2)
  return { id: i, d: arcPath(R, from, to), head: headPath(R, to), plusX: round(mid.x), plusY: round(mid.y) }
})

interface FlyNode {
  id: number
  deg: number
  name: string
  line: string
  proof: string
}

const NODES: FlyNode[] = [
  {
    id: 1,
    deg: -90,
    name: '更好的交付',
    line: '东西真的更好用了，客户能说出哪里不一样。',
    proof: '靠这一格撑着：返工变少、投诉变短'
  },
  {
    id: 2,
    deg: -18,
    name: '更多老客户',
    line: '回头的人不需要你再花钱去买一次。',
    proof: '看这一格有没有动：老客带来的单占比'
  },
  {
    id: 3,
    deg: 54,
    name: '更低的获客成本',
    line: '省下来的广告费不是天上掉的，是交付换来的。',
    proof: '同一渠道，单个新客花的钱往下走'
  },
  {
    id: 4,
    deg: 126,
    name: '更多可投回的钱',
    line: '把省下的钱投回交付，而不是再投回投放。',
    proof: '这一步最容易被"再多买点量"拐走'
  },
  {
    id: 5,
    deg: 198,
    name: '绕回更好的交付',
    line: '第 5 格不是新环节，是第 1 格又回来了一次，只是要求更高。',
    proof: '绕回来时，你的成本结构和口碑都变了'
  }
]

const nodeAt = (deg: number) => {
  const p = polar(R, deg)
  return { cx: round(p.x), cy: round(p.y) }
}

const NODE_POINTS = NODES.map((n) => ({ ...n, ...nodeAt(n.deg) }))

/** 打断点：不在环上加新环节，只把两处"最容易断"的地方涂成警示色 */
const BREAKS = [
  {
    key: 'A',
    nodeId: 1,
    title: '打断点 A：交付质量下滑',
    how: '赶工期、压成本、换便宜的人——三条都够把第 1 格打断。',
    after: '老客户变成差评来源，第 2 格反向走，获客成本立刻掉头往上。',
    fix: '先把返工率和投诉写进周会，再谈增长。'
  },
  {
    key: 'B',
    nodeId: 4,
    title: '打断点 B：现金断供',
    how: '账上有利润、钱全在别人兜里；或者省下的钱被一次性花光。',
    after: '投不回交付，环停在第 3 与第 4 格之间，前面攒的口碑慢慢漏光。',
    fix: '投回之前先留够下一轮的现金，现金是这条环的润滑油。'
  }
].map((b) => {
  const node = NODE_POINTS.find((n) => n.id === b.nodeId)!
  const mark = polar(R + 36, node.deg)
  return { ...b, ringCx: node.cx, ringCy: node.cy, markX: round(mark.x), markY: round(mark.y) }
})

const PLUS_LABEL = '+ 增强：前面一格把后面一格推高'
const BREAK_LABEL = '断：环上任何一格没人推，整条停住'
</script>

<template>
  <div class="sb-flywheel-diagram sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Flywheel · 增长飞轮怎么接上</span>
      <p class="sb-widget-sub">五格连成一个环。看的是哪一格先动、哪一格一断就全停。</p>
    </div>

    <figure class="sb-flywheel-diagram-fig">
      <div class="sb-flywheel-diagram-layout">
        <div class="sb-flywheel-diagram-plot">
          <svg
            class="sb-flywheel-diagram-svg"
            viewBox="0 0 340 340"
            role="presentation"
            aria-hidden="true"
            focusable="false"
          >
            <path
              v-for="l in LINKS"
              :key="`arc-${l.id}`"
              class="sb-flywheel-diagram-arc"
              :d="l.d"
            />
            <path
              v-for="l in LINKS"
              :key="`head-${l.id}`"
              class="sb-flywheel-diagram-arrow"
              :d="l.head"
            />
            <text
              v-for="l in LINKS"
              :key="`plus-${l.id}`"
              class="sb-flywheel-diagram-plus"
              :x="l.plusX"
              :y="l.plusY + 4"
            >
              +
            </text>

            <g v-for="n in NODE_POINTS" :key="`node-${n.id}`">
              <circle class="sb-flywheel-diagram-node" :cx="n.cx" :cy="n.cy" r="20" />
              <text class="sb-flywheel-diagram-num" :x="n.cx" :y="n.cy + 4">{{ n.id }}</text>
            </g>

            <g v-for="b in BREAKS" :key="`break-${b.key}`">
              <circle
                class="sb-flywheel-diagram-break-ring"
                :cx="b.ringCx"
                :cy="b.ringCy"
                r="27"
              />
              <circle
                class="sb-flywheel-diagram-break-dot"
                :cx="b.markX"
                :cy="b.markY"
                r="13"
              />
              <text class="sb-flywheel-diagram-break-text" :x="b.markX" :y="b.markY + 4">断</text>
            </g>

            <text class="sb-flywheel-diagram-center" :x="CX" :y="CY - 6">
              你真正在推的
            </text>
            <text class="sb-flywheel-diagram-center" :x="CX" :y="CY + 14">是哪一环</text>
            <text class="sb-flywheel-diagram-center-sub" :x="CX" :y="CY + 34">每一环都要人推</text>
          </svg>
        </div>

        <div class="sb-flywheel-diagram-copy">
          <p class="sb-flywheel-diagram-legend" aria-hidden="true">
            <span class="sb-flywheel-diagram-key is-plus">{{ PLUS_LABEL }}</span>
            <span class="sb-flywheel-diagram-key is-break">{{ BREAK_LABEL }}</span>
          </p>

          <ul class="sb-flywheel-diagram-nodes">
            <li v-for="n in NODES" :key="n.id" class="sb-flywheel-diagram-item">
              <span class="sb-flywheel-diagram-badge">{{ n.id }}</span>
              <div class="sb-flywheel-diagram-body">
                <span class="sb-flywheel-diagram-name">{{ n.name }}</span>
                <span class="sb-flywheel-diagram-line">{{ n.line }}</span>
                <span class="sb-flywheel-diagram-proof">{{ n.proof }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <span class="sr-only">
        飞轮五格依次是：一，更好的交付；二，更多老客户；三，更低的获客成本；四，更多可投回的钱；
        第五格不是新环节，是绕回第一格「更好的交付」。相邻两格之间都是增强关系（图上标
        加号），意思是前面一格把后面一格推高。环外另有两处珊瑚色的打断点：A 在第 1
        格「更好的交付」上，交付质量一下滑，老客户就变成差评来源，获客成本反向上涨；B
        在第 4 格「更多可投回的钱」上，现金一断，投不回交付，环就停在第 3 格与第 4
        格之间。这张图不承诺飞轮会自动转，每一环都需要人推。
      </span>
    </figure>

    <ul class="sb-flywheel-diagram-breaks">
      <li v-for="b in BREAKS" :key="b.key" class="sb-flywheel-diagram-break">
        <span class="sb-flywheel-diagram-break-title">{{ b.title }}</span>
        <span class="sb-flywheel-diagram-break-row">
          <em>怎么断</em>{{ b.how }}
        </span>
        <span class="sb-flywheel-diagram-break-row">
          <em>断了会</em>{{ b.after }}
        </span>
        <span class="sb-flywheel-diagram-break-row">
          <em>先做什么</em>{{ b.fix }}
        </span>
      </li>
    </ul>

    <p class="sb-cap">
      这条环的顺序是 <b>交付 → 老客户 → 获客成本下降 → 有钱投回 → 再回到交付</b>，绕一圈回到起点。
      两处最容易断：<b>交付质量下滑</b>和<b>现金断供</b>。飞轮不会自己转，
      <b>每一环都要有人推</b>——它只是让你花的每一块钱更容易被下一块钱接上。
    </p>
  </div>
</template>

<style scoped>
.sb-flywheel-diagram-fig {
  margin: 0;
}

.sb-flywheel-diagram-layout {
  display: grid;
  grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.sb-flywheel-diagram-plot {
  min-width: 0;
}

.sb-flywheel-diagram-svg {
  display: block;
  width: 100%;
  height: auto;
}

.sb-flywheel-diagram-arc {
  fill: none;
  stroke: var(--accent);
  stroke-width: 2.2;
  stroke-linecap: round;
  opacity: 0.5;
}

.sb-flywheel-diagram-arrow {
  fill: var(--accent);
  opacity: 0.8;
}

.sb-flywheel-diagram-plus {
  font-family: var(--font-mono);
  font-size: 13px;
  fill: var(--accent);
  text-anchor: middle;
}

.sb-flywheel-diagram-node {
  fill: var(--panel-2);
  stroke: var(--accent);
  stroke-width: 1.8;
}

.sb-flywheel-diagram-num {
  font-family: var(--font-mono);
  font-size: 12.5px;
  fill: var(--ink-2);
  text-anchor: middle;
}

.sb-flywheel-diagram-break-ring {
  fill: none;
  stroke: var(--coral);
  stroke-width: 1.4;
  stroke-dasharray: 4 5;
}

.sb-flywheel-diagram-break-dot {
  fill: var(--coral-soft);
  stroke: var(--coral);
  stroke-width: 1.4;
}

.sb-flywheel-diagram-break-text {
  font-family: var(--font-mono);
  font-size: 10px;
  fill: var(--coral);
  text-anchor: middle;
}

.sb-flywheel-diagram-center {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 700;
  fill: var(--ink);
  text-anchor: middle;
}

.sb-flywheel-diagram-center-sub {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  fill: var(--faint);
  text-anchor: middle;
}

.sb-flywheel-diagram-copy {
  min-width: 0;
}

.sb-flywheel-diagram-legend {
  display: grid;
  gap: 5px;
  margin: 0 0 12px;
}

.sb-flywheel-diagram-key {
  font-family: var(--font-mono);
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  color: var(--faint);
  overflow-wrap: anywhere;
}

.sb-flywheel-diagram-key.is-break {
  color: var(--coral);
}

.sb-flywheel-diagram-nodes {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-flywheel-diagram-item {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  gap: 9px;
  padding-bottom: 10px;
  border-bottom: 1px dashed var(--line-strong);
  transition: border-color 0.2s var(--ease);
}

.sb-flywheel-diagram-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sb-flywheel-diagram-item:hover {
  border-bottom-color: var(--accent);
}

.sb-flywheel-diagram-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 1px solid var(--accent);
  border-radius: 50%;
  background: var(--accent-soft);
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-2);
}

.sb-flywheel-diagram-body {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.sb-flywheel-diagram-name {
  font-size: 13.5px;
  font-weight: 680;
  color: var(--ink);
}

.sb-flywheel-diagram-line {
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sb-flywheel-diagram-proof {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-flywheel-diagram-breaks {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.sb-flywheel-diagram-break {
  display: grid;
  gap: 4px;
  padding: 12px 13px;
  border: 1px solid var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
}

.sb-flywheel-diagram-break-title {
  font-size: 12.5px;
  font-weight: 680;
  color: var(--coral);
}

.sb-flywheel-diagram-break-row {
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sb-flywheel-diagram-break-row em {
  display: block;
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-style: normal;
  letter-spacing: 0.1em;
  color: var(--faint);
}

@media (max-width: 760px) {
  /* 窄屏：图先站上面当正方形，节点说明变成下面一整列，别把环挤成椭圆 */
  .sb-flywheel-diagram-layout {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .sb-flywheel-diagram-plot {
    max-width: 300px;
    margin-inline: auto;
  }

  .sb-flywheel-diagram-breaks {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-flywheel-diagram-item {
    transition: none;
  }
}
</style>
