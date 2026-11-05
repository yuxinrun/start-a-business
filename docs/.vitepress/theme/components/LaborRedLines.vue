<script setup lang="ts">
interface RedLine {
  title: string
  wrong: string
  why: string
  right: string
  refs: string
}

// 这一页讲的是法律，不放玩笑，语气放软但结论说清楚。
// 条文序号与具体口径全部标"待核"：以现行有效的法律文本和当地人社部门口径为准。
const RED_LINES: RedLine[] = [
  {
    title: '先干活，合同等转正再补',
    wrong: '入职时说好"先做两个月，合适再签合同"，或者只有一份"试用期协议"。',
    why: '用工之日起劳动关系就已经建立，书面合同应当在这之后一个月内订立；试用期是包含在劳动合同期限里的，单独的"试用期合同"并不能把责任推开。长期不签，还可能引发二倍工资的责任（劳动合同法第 10 条、第 82 条，条文与适用口径待核）。',
    right: '入职当天或之前签书面劳动合同，试用期写进同一份合同里，期限、岗位、工资构成写明；员工与公司各持一份，并留下签收记录。',
    refs: '第 10 条 / 第 19 条 / 第 82 条（待核）'
  },
  {
    title: '试用期想拖多久拖多久，换个岗位重新试',
    wrong: '"先干六个月看看"，或者调了部门之后再来一次试用期。',
    why: '试用期上限跟合同期限挂钩，并且同一用人单位与同一劳动者只能约定一次试用期。合同期限不满三个月、或以完成一定工作任务为期限的，不得约定试用期（劳动合同法第 19 条，具体档位待核）。',
    right: '先确定合同期限，再按对应上限约定试用期；想确认人合不合适，用明确的转正标准和考核记录，而不是把试用期当作打折用人的窗口。',
    refs: '第 19 条（待核）'
  },
  {
    title: '试用期工资对折，社保换成现金',
    wrong: '试用期只给约定工资的六折，或让员工签一份"自愿放弃社保声明"，把单位该缴的部分折成补贴发下去。',
    why: '试用期工资不得低于本单位相同岗位最低档工资或者劳动合同约定工资的 80%，并且不得低于当地最低工资标准。缴纳社会保险是法定义务，个人"自愿放弃"的声明不能免除单位的缴费义务；一旦发生工伤，本来可由基金承担的部分可能落到单位身上（第 20 条、第 72 条，口径待核）。',
    right: '按期足额参保，工资标准和构成写进合同与工资条；即便另外安排补贴，也不能替代参保义务。具体基数与比例请打 12333 确认当年当地口径。',
    refs: '第 20 条 / 第 72 条（待核）'
  },
  {
    title: '加班靠"自觉"，不留记录也不给钱',
    wrong: '口头要求"做完再走"，考勤只记上班不记下班，加班一律说成"以后调休"。',
    why: '延长工作时间有上限，平时、休息日、法定节假日的加班报酬比例也不同；调休只适用于其中一部分情形。考勤记录与工资支付凭证由用人单位保存，发生争议时拒不提供可能承担不利后果（劳动法第 41 条、第 44 条及相关司法解释，表述待核）。',
    right: '加班走审批、留打卡记录，工资条上单独列明加班报酬；休息日加班优先安排补休，法定节假日加班不能用补休替代应付的报酬（待核）。规则写在员工手册里，并让每个人签收。',
    refs: '第 41 条 / 第 44 条（待核）'
  },
  {
    title: '觉得不合适，随时让他走',
    wrong: '口头辞退、当天清出工位、只给一个月工资当"补偿"，或者反过来要求员工"主动辞职"。',
    why: '解除劳动关系有条件和程序。经济补偿按工作年限计算：每满一年支付一个月工资，六个月以上不满一年按一年计，不满六个月支付半个月；无过失性辞退未提前三十日书面通知的，还要多支付一个月工资作为代通知金；违法解除的，劳动者可以要求继续履行合同，或者要求按经济补偿标准二倍的赔偿金（第 40 条、第 47 条、第 48 条、第 87 条，口径待核）。',
    right: '先把"什么算不合格"写清楚并留下记录，再走书面通知与面谈；解除协议里写明补偿金额、支付时间和办理事项。拿不准就先咨询 12333 或专业律师，再决定怎么说、什么时候说。',
    refs: '第 40 / 47 / 48 / 87 条（待核）'
  },
  {
    title: '竞业限制全员都签，离职时却不给补偿',
    wrong: '所有岗位一律签竞业协议，离职时口头叮嘱一句"别做这行"，协议里不谈补偿。',
    why: '竞业限制的人员范围限于高级管理人员、高级技术人员和其他负有保密义务的人员，约定期限不得超过二年，并且在限制期内应当按月支付经济补偿；补偿标准没有约定或有争议时，司法实践另有具体算法（第 23 条、第 24 条，标准待核）。范围铺得太大、补偿不到位，协议既难真正执行，也可能反过来增加成本。',
    right: '只对确实接触核心商业秘密的岗位签，写清限制范围、地域、期限、补偿金额与支付方式；不再需要限制时，在离职环节书面告知解除。',
    refs: '第 23 条 / 第 24 条（待核）'
  }
]

// 试用期上限示意（待核）：横轴为月数，最长 6 个月
const PROBATION = [
  { band: '合同期 3 个月以上不满 1 年', months: 1 },
  { band: '合同期 1 年以上不满 3 年', months: 2 },
  { band: '合同期 3 年以上或无固定期限', months: 6 }
]
const PROBATION_MAX = 6

// 三档城市的社保公积金企业负担差别大，具体比例一律以当年当地口径为准
const CHANNELS = [
  { name: '12333', label: '人力资源社会保障服务热线', text: '问参保、缴费基数、最低工资标准、加班与经济补偿的口径。免费咨询，答的是"当地现行怎么算"。' },
  { name: '律师', label: '专业劳动法律师', text: '合同文本、解除谈判、仲裁与诉讼代理。花一次咨询的钱，通常比事后赔偿便宜。' },
  { name: '12348', label: '公共法律服务热线 / 法律援助', text: '劳动者一侧的免费法律渠道，也可用于工会与调解资源的对接（可及性待核）。' }
]
</script>

<template>
  <div class="sb-labor-red-lines sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Labour Red Lines · 用工红线</span>
      <p class="sb-widget-sub">六条常见做法和它们各自的代价，这里只讲怎么合规，不讲怎么绕开。</p>
    </div>

    <p class="sb-labor-red-lines-notice">
      劳动关系的问题大多不是"不知道规定"，而是出在没写下来、没留记录。下面每条按
      <b>常见做法 → 为什么不行 → 正确做法</b> 三段来读；条文序号与具体口径标注为
      <b>待核</b>，请以现行有效的法律文本和当地人社部门口径为准。
    </p>

    <ul class="sb-labor-red-lines-list">
      <li v-for="(r, i) in RED_LINES" :key="r.title" class="sb-labor-red-lines-card">
        <p class="sb-labor-red-lines-card-head">
          <span class="sb-labor-red-lines-no">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="sb-labor-red-lines-title">{{ r.title }}</span>
        </p>
        <dl class="sb-labor-red-lines-body">
          <div class="sb-labor-red-lines-pair">
            <dt>常见做法</dt>
            <dd>{{ r.wrong }}</dd>
          </div>
          <div class="sb-labor-red-lines-pair is-why">
            <dt>为什么不行</dt>
            <dd>{{ r.why }}</dd>
          </div>
          <div class="sb-labor-red-lines-pair is-right">
            <dt>正确做法</dt>
            <dd>{{ r.right }}</dd>
          </div>
        </dl>
        <p class="sb-labor-red-lines-refs">{{ r.refs }}</p>
      </li>
    </ul>

    <div class="sb-labor-red-lines-probation">
      <p class="sb-labor-red-lines-sub-title">试用期上限：三档一次看完（待核）</p>
      <div class="sb-labor-red-lines-rows">
        <div v-for="p in PROBATION" :key="p.band" class="sb-labor-red-lines-row">
          <span class="sb-labor-red-lines-row-name">{{ p.band }}</span>
          <span class="sb-labor-red-lines-track" aria-hidden="true">
            <span
              class="sb-labor-red-lines-fill"
              :style="{ width: (p.months / PROBATION_MAX) * 100 + '%' }"
            ></span>
          </span>
          <span class="sb-labor-red-lines-val">{{ p.months }} 个月</span>
        </div>
      </div>
      <p class="sb-labor-red-lines-probation-note">
        同一用人单位与同一劳动者只能约定一次试用期；合同期不满三个月或以完成一定工作任务为期限的，
        不得约定试用期。
      </p>
    </div>

    <div class="sb-labor-red-lines-help">
      <p class="sb-labor-red-lines-sub-title">遇到具体个案，先问这三个地方</p>
      <div class="sb-labor-red-lines-channels">
        <div v-for="c in CHANNELS" :key="c.name" class="sb-labor-red-lines-channel">
          <p class="sb-labor-red-lines-channel-name">{{ c.name }}</p>
          <p class="sb-labor-red-lines-channel-label">{{ c.label }}</p>
          <p class="sb-labor-red-lines-channel-text">{{ c.text }}</p>
        </div>
      </div>
      <p class="sb-labor-red-lines-help-line">
        本页不构成法律意见。个案请以当地人社局 12333 的口径和专业律师意见为准。
      </p>
    </div>

    <span class="sr-only">
      共 6 条用工红线：先干活后签合同、试用期反复延长、试用期工资打折并用现金替代社保、
      加班不留记录不给报酬、随意辞退、竞业限制全员签署却不给补偿。关键数字：劳动合同应在用工之日起
      一个月内订立；试用期上限按合同期限分三档，分别为 1 个月、2 个月、6 个月，同一劳动者只能约定一次；
      试用期工资不低于约定工资的 80%，且不低于当地最低工资标准；经济补偿按工作年限每满一年支付
      1 个月工资，六个月以上不满一年按一年计，不满六个月支付半个月工资；无过失性辞退未提前
      30 日书面通知的再加 1 个月代通知金；违法解除的赔偿金按经济补偿标准的 2 倍；
      竞业限制期限不超过 2 年，限制期内应按月支付经济补偿。以上条文与口径均待核。
      求助渠道：当地人社局 12333 热线、专业劳动法律师、12348 公共法律服务热线。
    </span>

    <p class="sb-cap">
      这六条的代价大多不是"被罚款"，而是<b>说不清</b>：没有书面合同、没有考勤记录、没有写下来的转正标准，
      争议时谁都没证据。记住三个数就够了——合同要在用工之日起<b>一个月内</b>签，试用期上限是
      <b>1 个月 / 2 个月 / 6 个月</b>三档且只能约定<b>一次</b>，试用期工资不低于约定的
      <b>80%</b> 且不低于当地最低工资。个案先打<b>当地人社局 12333</b>，涉及解除、竞业和仲裁的，
      再找<b>专业律师</b>；条文口径与补偿标准<b>每年每地不同，以当年当地口径与专业意见为准</b>。
    </p>
  </div>
</template>

<style scoped>
.sb-labor-red-lines-notice {
  margin: 0 0 16px;
  padding: 11px 14px;
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background: var(--panel-2);
  font-size: 12.5px;
  line-height: 1.65;
  color: var(--ink-2);
}

.sb-labor-red-lines-notice b {
  color: var(--accent);
  font-weight: 680;
}

.sb-labor-red-lines-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
}

.sb-labor-red-lines-card {
  padding: 14px 15px 12px;
  border: 1px solid var(--line);
  border-left: 3px solid var(--coral);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-labor-red-lines-card-head {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin: 0 0 10px;
}

.sb-labor-red-lines-no {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--coral);
}

.sb-labor-red-lines-title {
  font-size: 14.5px;
  font-weight: 700;
  line-height: 1.5;
  color: var(--ink);
}

.sb-labor-red-lines-body {
  margin: 0;
  display: grid;
  gap: 8px;
}

.sb-labor-red-lines-pair {
  display: grid;
  grid-template-columns: 84px minmax(0, 1fr);
  gap: 10px;
  align-items: baseline;
}

.sb-labor-red-lines-pair dt {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.sb-labor-red-lines-pair dd {
  margin: 0;
  font-size: 13px;
  line-height: 1.62;
  color: var(--ink-2);
}

.sb-labor-red-lines-pair.is-why dt {
  color: var(--coral);
}

.sb-labor-red-lines-pair.is-right dt {
  color: var(--accent);
}

.sb-labor-red-lines-pair.is-right dd {
  color: var(--ink);
}

.sb-labor-red-lines-refs {
  margin: 9px 0 0;
  padding-top: 8px;
  border-top: 1px dashed var(--line-strong);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
  color: var(--muted);
}

.sb-labor-red-lines-sub-title {
  margin: 0 0 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-labor-red-lines-probation,
.sb-labor-red-lines-help {
  margin-top: 18px;
  padding: 15px 16px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--panel);
}

.sb-labor-red-lines-help {
  border-style: dashed;
  background: var(--panel-2);
}

.sb-labor-red-lines-rows {
  display: grid;
  gap: 8px;
}

/* 条形只放在 minmax(0,1fr) 这一列里，数值另起一列，窄屏不会溢出 */
.sb-labor-red-lines-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 68px;
  align-items: center;
  gap: 10px;
}

.sb-labor-red-lines-row-name {
  grid-column: 1 / -1;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ink-2);
}

.sb-labor-red-lines-track {
  display: block;
  min-width: 0;
  height: 12px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-3);
  overflow: hidden;
}

.sb-labor-red-lines-fill {
  display: block;
  height: 100%;
  background: var(--blue);
  transition: width 0.3s var(--ease);
}

.sb-labor-red-lines-val {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
  text-align: right;
}

.sb-labor-red-lines-probation-note {
  margin: 11px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-labor-red-lines-channels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.sb-labor-red-lines-channel {
  min-width: 0;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel);
}

.sb-labor-red-lines-channel-name {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--accent);
}

.sb-labor-red-lines-channel-label {
  margin: 2px 0 6px;
  font-size: 11.5px;
  line-height: 1.4;
  color: var(--ink);
  font-weight: 620;
}

.sb-labor-red-lines-channel-text {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-labor-red-lines-help-line {
  margin: 13px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--ink-2);
}

@media (max-width: 760px) {
  .sb-labor-red-lines-pair {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }

  .sb-labor-red-lines-channels {
    grid-template-columns: minmax(0, 1fr);
  }

  .sb-labor-red-lines-row {
    grid-template-columns: minmax(0, 1fr) 62px;
    gap: 8px;
  }

  .sb-labor-red-lines-card,
  .sb-labor-red-lines-probation,
  .sb-labor-red-lines-help {
    padding: 12px 12px 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-labor-red-lines-fill {
    transition: none;
  }
}
</style>
