<script setup lang="ts">
interface Source {
  name: string
  tone: string
  rank: string
  tier: number
  say: string
}

interface Rule {
  title: string
  plain: string
  means: string
  chip: string
  hard: boolean
}

// 条宽表示"多少公司靠它"的排序档位，不是金额占比：公开统计里没有这一列（待核）。
const SOURCES: Source[] = [
  {
    name: '自有资金',
    tone: 'self',
    rank: '主力',
    tier: 36,
    say: '存款、卖房、配偶工资——绝大多数中国新公司的第一笔钱是这里来的。',
  },
  {
    name: '亲友',
    tone: 'kin',
    rank: '常见',
    tier: 22,
    say: '借得起但最容易翻脸。写借条、写利息、写还期，感情才留得住。',
  },
  {
    name: '银行贷款与政策性担保',
    tone: 'bank',
    rank: '常见',
    tier: 18,
    say: '不稀释股份的钱。政府性融资担保、创业担保贷款各地都有，去当地政务网查。',
  },
  {
    name: '政府补贴与园区扶持',
    tone: 'gov',
    rank: '一部分',
    tier: 14,
    say: '社保补贴、场租减免、大赛奖金。能拿，但别把它算进收入模型。',
  },
  {
    name: '天使与机构投资',
    tone: 'vc',
    rank: '极少数',
    tier: 10,
    say: '绝大多数新公司一辈子拿不到机构投资——这一条不印百分比，因为没有可靠口径。',
  }
]

const RULES: Rule[] = [
  {
    title: '注册资本：认缴不等于不缴',
    plain:
      '2023 年修订、2024 年 7 月 1 日施行的《公司法》要求：全体股东认缴的出资额自公司成立之日起 5 年内缴足；存量公司须在 2027 年 6 月 30 日前把剩余认缴期限调整到 5 年内。股份有限公司的发起人则要在公司成立前全额缴纳股款，没有 5 年缓冲。',
    means: '写 1000 万注册资本 = 承诺 5 年内真掏 1000 万。官方批评过"盲目认缴、天价认缴"，注册资本不是越大越有实力。',
    chip: '法条明文 · 条号待核',
    hard: false
  },
  {
    title: '股东出资责任：有限责任不是护身符',
    plain:
      '没按期足额缴纳的，除要向公司足额缴纳外，还要对已按期缴纳的股东承担违约责任、对公司损失负赔偿责任；公司可以书面催缴并给出宽限期，宽限期届满仍不缴的，可发出失权通知，股东就丧失未缴出资那部分股权。',
    means: '欠的债一般停在认缴出资的范围内，但"该缴没缴"的那部分会直接追到你自己身上。几个合伙人一起开公司，先把出资时间表写进章程。',
    chip: '方向明确 · 宽限期与条号待核',
    hard: false
  },
  {
    title: '对赌与回购：法院怎么看',
    plain:
      '通行口径是：投资方与股东或实际控制人签的对赌，没有法定无效事由的一般认定有效并支持实际履行；与目标公司签的对赌，协议原则上不因此无效，但要求公司回购通常得先完成减资程序，减资没做完可能被驳回。监管层面已有点名要规范私募基金"对赌协议"的文件，专门制度尚未出台。',
    means: '创始人个人签下的回购条款，很可能真由你个人来履行。回购权要在多长"合理期间"内行使，最高法有过表态（一说 6 个月），必须回原文核对后才敢当真。',
    chip: '司法口径 · 期间与文号待核',
    hard: true
  },
  {
    title: '地方产业基金的钱要"返投"',
    plain:
      '拿了政府引导基金或地方产业基金的钱，通常被要求把一定比例投回本地、或把注册地/税收落在当地。倍数、认定方式与豁免条件由各地管理办法自定，差异极大，公开可比的统一口径不存在。',
    means: '这一条不能印具体倍数：去你想拿钱的那个地方的引导基金官网，把管理办法原文读一遍，再算"这笔钱有多贵"。2024 年以来多地确实有所放宽。',
    chip: '各地自定 · 倍数不可印',
    hard: true
  }
]

const tierStyle = (s: Source) => ({ width: s.tier + '%' })
</script>

<template>
  <div class="sb-fund-sources-cn sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Where The Money Comes From · 中国的钱从哪来</span>
      <p class="sb-widget-sub">先看钱真正从哪来，再看这些钱后面拴着什么规矩。</p>
    </div>

    <figure class="sb-fund-sources-cn-fig">
      <div class="sb-fund-sources-cn-cap-row">
        <span class="sb-fund-sources-cn-mini">来源常见度档位（越靠左靠得越多）</span>
        <span class="sb-fund-sources-cn-warn">条宽 = 排序档位，不是金额占比 · 待核</span>
      </div>

      <div class="sb-fund-sources-cn-bar" aria-hidden="true">
        <span
          v-for="s in SOURCES"
          :key="s.name"
          class="sb-fund-sources-cn-seg"
          :class="'is-' + s.tone"
          :style="tierStyle(s)"
        >
          <span class="sb-fund-sources-cn-seg-name">{{ s.name }}</span>
          <span class="sb-fund-sources-cn-seg-rank">{{ s.rank }}</span>
        </span>
      </div>

      <ul class="sb-fund-sources-cn-list">
        <li v-for="s in SOURCES" :key="'li' + s.name" class="sb-fund-sources-cn-item" :class="'is-' + s.tone">
          <span class="sb-fund-sources-cn-item-name">{{ s.name }}</span>
          <span class="sb-fund-sources-cn-tierwrap">
            <span class="sb-fund-sources-cn-tiertrack" aria-hidden="true">
              <span class="sb-fund-sources-cn-tierbar" :style="tierStyle(s)"></span>
            </span>
            <span class="sb-fund-sources-cn-tierlabel">{{ s.rank }}</span>
          </span>
          <p class="sb-fund-sources-cn-say">{{ s.say }}</p>
        </li>
      </ul>

      <span class="sr-only">
        五个来源按常见度从多到少排列：自有资金（最多，主力）、亲友、银行贷款与政策性担保、
        政府补贴与园区扶持、天使与机构投资（最少，只有极少数公司拿到）。
        这一条图上没有任何百分比：公开统计里找不到"新创公司启动资金来源结构"的可靠口径，
        所以条宽只表示排序，属待核，不印具体占比。可以讲满的一句是：绝大多数新公司一辈子拿不到机构投资。
        下面四条本土规则里的数字是：认缴出资自公司成立之日起 5 年内缴足，存量公司须在 2027 年 6 月 30 日前
        把剩余认缴期限调整到 5 年以内；股份有限公司的发起人要在公司成立前全额缴清股款，没有这 5 年缓冲；
        未按期缴足的，除了向公司补缴，还要对已缴足的股东承担违约责任，公司催缴并给出宽限期后可发失权通知；
        对赌与回购方面，跟股东或实控人签的一般认定有效并可实际履行，跟公司签的要公司回购通常需先完成减资，
        最高法关于回购权行使的合理期间有过表态（一说 6 个月，待核）；地方产业基金普遍要求返投，
        倍数由各地办法自定，差异太大，这里不印任何具体倍数。
      </span>
    </figure>

    <div class="sb-fund-sources-cn-rules">
      <p class="sb-fund-sources-cn-ruletitle">本土规则：这四条改的是你的钱和法律风险</p>
      <ol class="sb-fund-sources-cn-rulelist">
        <li
          v-for="(r, i) in RULES"
          :key="r.title"
          class="sb-fund-sources-cn-rule"
          :class="r.hard ? 'is-hard' : 'is-plain'"
        >
          <span class="sb-fund-sources-cn-idx">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="sb-fund-sources-cn-rulebody">
            <p class="sb-fund-sources-cn-rulename">{{ r.title }}</p>
            <p class="sb-fund-sources-cn-ruleplain">{{ r.plain }}</p>
            <p class="sb-fund-sources-cn-rulemeans">{{ r.means }}</p>
            <span class="sb-fund-sources-cn-chip">{{ r.chip }}</span>
          </div>
        </li>
      </ol>
    </div>

    <p class="sb-cap">
      中国式起点：<b>自己的钱</b>排第一，亲友和银行贷款紧随其后，<b>机构投资在最后一条</b>——
      而且<b>绝大多数新公司一辈子拿不到它</b>（没有可靠占比，此处不印百分比，待核）。真正容易被忽略的是规矩而不是比例：
      认缴出资要<b>自公司成立起 5 年内缴足</b>，存量公司<b>2027 年 6 月 30 日前</b>要把期限调进 5 年；
      创始人个人签的对赌回购条款，法院通常支持实际履行；地方基金的钱一般拴着<b>返投</b>。
      以上全部以当年当地口径与专业意见为准，本页不预测政策变化，也不提供任何避税方案。
    </p>
  </div>
</template>

<style scoped>
.sb-fund-sources-cn-fig {
  margin: 0 0 6px;
}

.sb-fund-sources-cn-cap-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.sb-fund-sources-cn-mini {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-fund-sources-cn-warn {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border: 1px dashed var(--coral);
  border-radius: 999px;
  color: var(--coral);
}

.sb-fund-sources-cn-bar {
  display: flex;
  min-width: 0;
  height: 46px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--panel-2);
}

.sb-fund-sources-cn-seg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 0;
  height: 100%;
  padding: 0 7px;
  border-right: 1px solid var(--panel);
  transition: opacity 0.3s var(--ease);
}

.sb-fund-sources-cn-seg:last-child {
  border-right: none;
}

.sb-fund-sources-cn-seg.is-self {
  background: var(--accent);
}

.sb-fund-sources-cn-seg.is-kin {
  background: var(--accent);
  opacity: 0.55;
}

.sb-fund-sources-cn-seg.is-bank {
  background: var(--blue);
  opacity: 0.78;
}

.sb-fund-sources-cn-seg.is-gov {
  background: var(--lime);
  opacity: 0.72;
}

.sb-fund-sources-cn-seg.is-vc {
  background: var(--coral);
}

.sb-fund-sources-cn-seg-name {
  font-size: 10.5px;
  font-weight: 660;
  line-height: 1.2;
  color: var(--ink);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sb-fund-sources-cn-seg-rank {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--ink-2);
  overflow: hidden;
  white-space: nowrap;
}

.sb-fund-sources-cn-list {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.sb-fund-sources-cn-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 118px;
  gap: 3px 10px;
  padding: 9px 11px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-fund-sources-cn-item.is-kin {
  border-left-color: var(--accent);
}

.sb-fund-sources-cn-item.is-bank {
  border-left-color: var(--blue);
}

.sb-fund-sources-cn-item.is-gov {
  border-left-color: var(--lime);
}

.sb-fund-sources-cn-item.is-vc {
  border-left-color: var(--coral);
}

.sb-fund-sources-cn-item-name {
  grid-column: 1;
  font-size: 12.5px;
  font-weight: 680;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-fund-sources-cn-tierwrap {
  grid-column: 2;
  grid-row: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  align-items: center;
  gap: 6px;
}

.sb-fund-sources-cn-tiertrack {
  display: block;
  min-width: 0;
  height: 9px;
  border-radius: 999px;
  background: var(--panel-3);
  overflow: hidden;
}

.sb-fund-sources-cn-tierbar {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--accent);
  transition: width 0.3s var(--ease);
}

.sb-fund-sources-cn-item.is-bank .sb-fund-sources-cn-tierbar {
  background: var(--blue);
}

.sb-fund-sources-cn-item.is-gov .sb-fund-sources-cn-tierbar {
  background: var(--lime);
}

.sb-fund-sources-cn-item.is-vc .sb-fund-sources-cn-tierbar {
  background: var(--coral);
}

.sb-fund-sources-cn-item.is-kin .sb-fund-sources-cn-tierbar {
  background: var(--accent);
  opacity: 0.6;
}

.sb-fund-sources-cn-tierlabel {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  color: var(--faint);
  white-space: nowrap;
}

.sb-fund-sources-cn-say {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 11.5px;
  line-height: 1.62;
  color: var(--muted);
}

.sb-fund-sources-cn-rules {
  margin-top: 20px;
}

.sb-fund-sources-cn-ruletitle {
  margin: 0 0 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent);
}

.sb-fund-sources-cn-rulelist {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: none;
}

.sb-fund-sources-cn-rule {
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
  padding: 12px 13px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
  box-shadow: var(--shadow);
}

.sb-fund-sources-cn-rule.is-hard {
  border-style: dashed;
  border-color: var(--coral);
}

.sb-fund-sources-cn-idx {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-fund-sources-cn-rulebody {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.sb-fund-sources-cn-rulename {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  line-height: 1.45;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-fund-sources-cn-ruleplain {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--ink-2);
}

.sb-fund-sources-cn-rulemeans {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
}

.sb-fund-sources-cn-chip {
  justify-self: start;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid var(--line-strong);
  color: var(--muted);
  background: var(--panel-2);
}

.sb-fund-sources-cn-rule.is-hard .sb-fund-sources-cn-chip {
  border-color: var(--coral);
  color: var(--coral);
  background: var(--coral-soft);
}

@media (max-width: 760px) {
  /* 窄屏的读法：横条（占比档位）放不下汉字，改成逐条纵列——信息一条不少 */
  .sb-fund-sources-cn-bar,
  .sb-fund-sources-cn-cap-row {
    display: none;
  }

  .sb-fund-sources-cn-item {
    grid-template-columns: minmax(0, 1fr);
  }

  .sb-fund-sources-cn-tierwrap {
    grid-column: 1;
    grid-row: auto;
  }

  .sb-fund-sources-cn-rule {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-fund-sources-cn-seg,
  .sb-fund-sources-cn-tierbar {
    transition: none;
  }
}
</style>
