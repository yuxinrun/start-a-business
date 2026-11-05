<script setup lang="ts">
// /start 的路标：从想法到规模化一共六步，标出最容易死人的两步。
// 桌面是横轴，≤760px 换成竖着读的一列——窄屏要的是另一种读法，不是等比缩小。

interface Stage {
  no: string
  name: string
  kill: string
  danger: boolean
}

const STAGES: Stage[] = [
  {
    no: '01',
    name: '想法与验证',
    kill: '还没跟真掏过钱的人聊过，就先去注册公司、做 logo。',
    danger: false
  },
  {
    no: '02',
    name: '开张（主体 + 首单）',
    kill: '执照办下来了，第一单却一直没落地——开张不等于开工。',
    danger: false
  },
  {
    no: '03',
    name: '活过第一年',
    kill: '账面上是赚的，钱全在别人兜里；第 8 个月现金先断。',
    danger: true
  },
  {
    no: '04',
    name: '单位经济算平',
    kill: '越卖越亏，只是一直没人算过"这一单到底留下几块"。',
    danger: true
  },
  {
    no: '05',
    name: '可复制（团队 / 流程）',
    kill: '创始人成了最贵的一线，一松手质量就塌回去。',
    danger: false
  },
  {
    no: '06',
    name: '规模化',
    kill: '流程只写在老板脑子里，人一走流程就跟着走。',
    danger: false
  }
]

const DANGER_COUNT = STAGES.filter((s) => s.danger).length
</script>

<template>
  <div class="sb-roadmap-strip sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Roadmap · 从想法到回本有几步</span>
      <p class="sb-widget-sub">六步是六步，但风险不均匀：珊瑚色那两步，淘汰的人最多。</p>
    </div>

    <figure class="sb-roadmap-strip-fig">
      <div class="sb-roadmap-strip-track">
        <span class="sb-roadmap-strip-axis" aria-hidden="true"></span>
        <ol class="sb-roadmap-strip-items">
          <li
            v-for="s in STAGES"
            :key="s.no"
            class="sb-roadmap-strip-item"
            :class="{ 'is-danger': s.danger }"
          >
            <span class="sb-roadmap-strip-dot" aria-hidden="true"></span>
            <div class="sb-roadmap-strip-body">
              <span class="sb-roadmap-strip-no">STEP {{ s.no }}</span>
              <span class="sb-roadmap-strip-name">{{ s.name }}</span>
              <span class="sb-roadmap-strip-kill">
                <em>最常见的死法</em>{{ s.kill }}
              </span>
            </div>
          </li>
        </ol>
      </div>

      <p class="sb-roadmap-strip-legend" aria-hidden="true">
        <span class="sb-roadmap-strip-key"><i></i>常规一步</span>
        <span class="sb-roadmap-strip-key is-danger"><i></i>珊瑚色 = {{ DANGER_COUNT }} 步最窄</span>
      </p>

      <span class="sr-only">
        六步依次是：第 01 步 想法与验证，最常见的死法是还没跟真掏过钱的人聊过就先去注册公司；
        第 02 步 开张，把主体办好并拿下首单，死法是执照办好了但第一单一直没落地；
        第 03 步 活过第一年，是危险步，死法是账面上赚钱但钱都在客户的账期里，第八个月现金先断；
        第 04 步 单位经济算平，也是危险步，死法是越卖越亏却没人算过一单留下多少钱；
        第 05 步 可复制，靠团队和流程，死法是创始人成了最贵的一线；
        第 06 步 规模化，死法是流程只写在老板脑子里，人一走流程就走。
        六步里两步标了警示色：第三步和第四步。
      </span>
    </figure>

    <p class="sb-cap">
      六步里最窄的是<b>第三步「活过第一年」</b>和<b>第四步「单位经济算平」</b>——前者死在现金上，
      后者死在"没人算过一单到底赚多少"上。前两步慢一点不致命，后两步踩空，
      <b>一般没有重来一次的机会</b>。步子可以跳着走，账不能不算。
    </p>
  </div>
</template>

<style scoped>
.sb-roadmap-strip-fig {
  margin: 0;
}

.sb-roadmap-strip-track {
  position: relative;
  min-width: 0;
}

/* 横轴：一条线穿过六个点 */
.sb-roadmap-strip-axis {
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--line-strong);
}

.sb-roadmap-strip-items {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-roadmap-strip-item {
  min-width: 0;
}

.sb-roadmap-strip-dot {
  display: block;
  width: 11px;
  height: 11px;
  margin-bottom: 10px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  background: var(--panel);
}

.sb-roadmap-strip-body {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.sb-roadmap-strip-no {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-roadmap-strip-name {
  font-size: 12.5px;
  font-weight: 670;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-roadmap-strip-kill {
  font-size: 11px;
  line-height: 1.6;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-roadmap-strip-kill em {
  display: block;
  margin-bottom: 2px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-roadmap-strip-item.is-danger .sb-roadmap-strip-dot {
  width: 15px;
  height: 15px;
  margin-top: -2px;
  border-color: var(--coral);
  background: var(--coral-soft);
}

.sb-roadmap-strip-item.is-danger .sb-roadmap-strip-name {
  color: var(--coral);
}

.sb-roadmap-strip-item.is-danger .sb-roadmap-strip-body {
  padding: 8px 9px;
  border: 1px dashed var(--coral);
  border-radius: var(--radius-sm);
}

.sb-roadmap-strip-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin: 16px 0 0;
}

.sb-roadmap-strip-key {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-roadmap-strip-key i {
  width: 9px;
  height: 9px;
  border: 2px solid var(--accent);
  border-radius: 50%;
}

.sb-roadmap-strip-key.is-danger i {
  border-color: var(--coral);
  background: var(--coral-soft);
}

@media (max-width: 760px) {
  /* 窄屏不再压横轴：改成竖着读的一列，线转到左边 */
  .sb-roadmap-strip-axis {
    top: 0;
    bottom: 0;
    left: 7px;
    right: auto;
    width: 1px;
    height: auto;
  }

  .sb-roadmap-strip-items {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  .sb-roadmap-strip-item {
    display: grid;
    grid-template-columns: 15px minmax(0, 1fr);
    gap: 8px;
  }

  .sb-roadmap-strip-dot {
    width: 11px;
    height: 11px;
    margin: 3px 0 0;
    justify-self: center;
  }

  .sb-roadmap-strip-item.is-danger .sb-roadmap-strip-dot {
    width: 13px;
    height: 13px;
    margin-top: 2px;
  }

  .sb-roadmap-strip-kill {
    font-size: 11.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-roadmap-strip-dot {
    transition: none;
  }
}
</style>
