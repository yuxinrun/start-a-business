<script setup lang="ts">
import { computed, ref } from 'vue'

interface Seg {
  label: string
  value: number
  tone: 'a' | 'a2' | 'b' | 'b2' | 'lime' | 'c'
  note: string
}

interface Tier {
  key: '一线' | '二线' | '三线'
  name: string
  cap: string
  segs: Seg[]
}

const WAGE = 10000

// 全部为示意口径（待核）：社保公积金费率、基数上下限、公积金比例每年每地都在动。
// 这里锁定的是一条读法——月薪只是成本的第一层。
const TIERS: Tier[] = [
  {
    key: '一线',
    name: '一线（北上广深）',
    cap: '公积金比例高、工位贵、招人贵',
    segs: [
      { label: '到手', value: 7670, tone: 'a', note: '扣掉个人社保公积金和个税之后，真正进他口袋的钱' },
      { label: '个人代扣', value: 2330, tone: 'a2', note: '从这 1 万工资里代扣，与到手相加才等于月薪 10,000 元' },
      { label: '企业社保公积金', value: 3790, tone: 'b', note: '养老、医疗、失业、工伤加公积金的企业部分（待核）' },
      { label: '福利与补贴', value: 700, tone: 'b2', note: '餐补、体检、节日、团建，按月摊开' },
      { label: '工位与设备', value: 900, tone: 'lime', note: '租金水电分摊、电脑与软件账号折旧' },
      { label: '招聘与管理隐性', value: 1000, tone: 'c', note: '一次招聘花费摊到在职期，加上主管带人与沟通的时间' }
    ]
  },
  {
    key: '二线',
    name: '二线（省会、计划单列市）',
    cap: '公积金常按 8% 缴，工位与工资差一档',
    segs: [
      { label: '到手', value: 8055, tone: 'a', note: '扣掉个人社保公积金和个税之后，真正进他口袋的钱' },
      { label: '个人代扣', value: 1945, tone: 'a2', note: '从这 1 万工资里代扣，与到手相加才等于月薪 10,000 元' },
      { label: '企业社保公积金', value: 3280, tone: 'b', note: '企业部分，公积金比例通常低于一线（待核）' },
      { label: '福利与补贴', value: 500, tone: 'b2', note: '餐补、体检、节日、团建，按月摊开' },
      { label: '工位与设备', value: 650, tone: 'lime', note: '租金水电分摊、电脑与软件账号折旧' },
      { label: '招聘与管理隐性', value: 800, tone: 'c', note: '招聘花费摊提，加上带人与沟通的时间' }
    ]
  },
  {
    key: '三线',
    name: '三线及以下',
    cap: '费率与公积金下限更低，隐性成本反而不低',
    segs: [
      { label: '到手', value: 8345, tone: 'a', note: '扣掉个人社保公积金和个税之后，真正进他口袋的钱' },
      { label: '个人代扣', value: 1655, tone: 'a2', note: '从这 1 万工资里代扣，与到手相加才等于月薪 10,000 元' },
      { label: '企业社保公积金', value: 2980, tone: 'b', note: '企业部分，公积金常按 5% 缴（待核）' },
      { label: '福利与补贴', value: 350, tone: 'b2', note: '餐补、体检、节日，按月摊开' },
      { label: '工位与设备', value: 450, tone: 'lime', note: '租金水电分摊、电脑与软件账号折旧' },
      { label: '招聘与管理隐性', value: 700, tone: 'c', note: '小城市候选人少，找人耗的时间常常更久' }
    ]
  }
]

// 纯交互：静态初值，服务端与客户端首帧一致
const tierKey = ref<Tier['key']>('一线')

const tier = computed(() => TIERS.find((t) => t.key === tierKey.value) ?? TIERS[0])
const total = computed(() => tier.value.segs.reduce((s, x) => s + x.value, 0))
const share = (v: number) => (v / total.value) * 100
const multiple = computed(() => total.value / WAGE)

const totals = computed(() => {
  const max = Math.max(...TIERS.map((t) => t.segs.reduce((s, x) => s + x.value, 0)))
  return TIERS.map((t) => {
    const sum = t.segs.reduce((s, x) => s + x.value, 0)
    return { key: t.key, name: t.name, sum, pct: (sum / max) * 100, times: sum / WAGE }
  })
})

const yuan = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const wan = (n: number) => (n / 10000).toFixed(2).replace(/0$/, '')
</script>

<template>
  <div class="sb-pay-cost-breakdown sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Real Cost Per Hire · 一个人的真实成本</span>
      <p class="sb-widget-sub">月薪 1 万元，每月从账上走出去的不止 1 万。换一档城市看看差多少。</p>
    </div>

    <div class="sb-pay-cost-breakdown-switch" role="group" aria-label="城市档位">
      <button
        v-for="t in totals"
        :key="t.key"
        type="button"
        class="sb-pay-cost-breakdown-tab"
        :class="{ 'is-on': tierKey === t.key }"
        :aria-pressed="tierKey === t.key"
        @click="tierKey = t.key"
      >
        {{ t.name }}
        <em>{{ t.times.toFixed(2) }}×</em>
      </button>
    </div>

    <p class="sb-pay-cost-breakdown-cap">{{ tier.name }}：{{ tier.cap }}。按 <b>月薪 10,000 元</b> 计。</p>

    <figure class="sb-pay-cost-breakdown-fig">
      <div class="sb-pay-cost-breakdown-plot">
        <div class="sb-pay-cost-breakdown-track">
          <span
            v-for="s in tier.segs"
            :key="s.label"
            class="sb-pay-cost-breakdown-seg"
            :class="'is-' + s.tone"
            :style="{ width: share(s.value) + '%' }"
          >
            <span class="sb-pay-cost-breakdown-seg-label" v-if="share(s.value) > 9">{{ s.label }}</span>
          </span>
        </div>
        <span class="sb-pay-cost-breakdown-sum">
          ¥{{ yuan(total) }}
          <em>{{ multiple.toFixed(2) }}×</em>
        </span>
      </div>

      <ul class="sb-pay-cost-breakdown-list">
        <li v-for="s in tier.segs" :key="s.label" class="sb-pay-cost-breakdown-item">
          <span class="sb-pay-cost-breakdown-item-name">
            <i :class="'is-' + s.tone" aria-hidden="true"></i>{{ s.label }}
          </span>
          <span class="sb-pay-cost-breakdown-item-track">
            <span class="sb-pay-cost-breakdown-item-fill" :class="'is-' + s.tone" :style="{ width: share(s.value) + '%' }"></span>
          </span>
          <span class="sb-pay-cost-breakdown-item-val">{{ yuan(s.value) }}</span>
          <span class="sb-pay-cost-breakdown-item-note">{{ s.note }}</span>
        </li>
      </ul>

      <span class="sr-only">
        以月薪 10,000 元为例，当前档位为{{ tier.name }}。六个组成部分，单位元每月：到手
        {{ yuan(tier.segs[0].value) }} 元；个人代扣（社保公积金与个税）
        {{ yuan(tier.segs[1].value) }} 元，前两项合计正好是 10,000 元月薪；企业社保公积金
        {{ yuan(tier.segs[2].value) }} 元；福利与补贴 {{ yuan(tier.segs[3].value) }} 元；工位与设备
        {{ yuan(tier.segs[4].value) }} 元；招聘与管理隐性成本 {{ yuan(tier.segs[5].value) }} 元。
        每月真实用人成本合计 {{ yuan(total) }} 元，约 {{ wan(total) }} 万元，是月薪的
        {{ multiple.toFixed(2) }} 倍。三个档位对照：一线 16,390 元、1.64 倍；二线 15,230 元、1.52 倍；
        三线及以下 14,480 元、1.45 倍。所有费率为示意，待核，以当地当年口径为准。
      </span>
    </figure>

    <p class="sb-pay-cost-breakdown-sub-title">同一份 1 万月薪，三档城市对照</p>
    <div class="sb-pay-cost-breakdown-tiers">
      <div v-for="t in totals" :key="t.key" class="sb-pay-cost-breakdown-tier-row">
        <span class="sb-pay-cost-breakdown-tier-name">{{ t.key }}</span>
        <span class="sb-pay-cost-breakdown-tier-track">
          <span class="sb-pay-cost-breakdown-tier-fill" :style="{ width: t.pct + '%' }"></span>
        </span>
        <span class="sb-pay-cost-breakdown-tier-val">{{ yuan(t.sum) }}</span>
      </div>
    </div>

    <p class="sb-cap">
      「给他 <b>1 万</b>」和「这个月这个人花 <b>约 1.45 万到 1.64 万</b>」两句都是真话，
      做预算要用后一句：一线合计 <b>16,390 元</b>、二线 <b>15,230 元</b>、三线 <b>14,480 元</b>，
      也就是名义工资的 <b>1.45 到 1.64 倍</b>。多出来的 <b>约 3,000 元</b>
      社保公积金你看得见，<b>1,000 元上下</b> 的工位、招聘和带人时间最容易漏。
      费率每年、每地不同，<b>这里是示意，以当地当年口径与专业意见为准</b>。
    </p>
  </div>
</template>

<style scoped>
.sb-pay-cost-breakdown-switch {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.sb-pay-cost-breakdown-tab {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  padding: 7px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  color: var(--ink-2);
  font-family: var(--font-sans);
  font-size: 12.5px;
  cursor: pointer;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease), color 0.2s var(--ease);
}

.sb-pay-cost-breakdown-tab em {
  font-family: var(--font-mono);
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.06em;
  color: var(--faint);
}

.sb-pay-cost-breakdown-tab:hover {
  border-color: var(--line-strong);
}

.sb-pay-cost-breakdown-tab.is-on {
  border-color: var(--accent);
  background: var(--accent-soft);
  color: var(--ink);
}

.sb-pay-cost-breakdown-tab.is-on em {
  color: var(--accent);
}

.sb-pay-cost-breakdown-cap {
  margin: 0 0 14px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--muted);
}

.sb-pay-cost-breakdown-cap b {
  color: var(--ink-2);
  font-weight: 680;
}

.sb-pay-cost-breakdown-fig {
  margin: 0;
}

/* 堆叠条单独占一列，合计另占一列：宽度参照物是轨道本身 */
.sb-pay-cost-breakdown-plot {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 104px;
  align-items: center;
  gap: 10px;
}

.sb-pay-cost-breakdown-track {
  display: flex;
  min-width: 0;
  height: 34px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--panel-2);
}

.sb-pay-cost-breakdown-seg {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 100%;
  padding-left: 6px;
  border-right: 1px solid var(--panel);
  transition: width 0.3s var(--ease);
}

.sb-pay-cost-breakdown-seg:last-child {
  border-right: none;
}

.sb-pay-cost-breakdown-seg-label {
  font-family: var(--font-mono);
  font-size: 9px;
  line-height: 1.15;
  letter-spacing: 0.02em;
  color: var(--ink-2);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sb-pay-cost-breakdown-sum {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--accent);
  white-space: nowrap;
}

.sb-pay-cost-breakdown-sum em {
  font-size: 10px;
  font-style: normal;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.sb-pay-cost-breakdown-list {
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 9px;
}

.sb-pay-cost-breakdown-item {
  display: grid;
  grid-template-columns: 116px minmax(0, 1fr) 62px;
  gap: 10px;
  align-items: center;
}

.sb-pay-cost-breakdown-item-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: var(--ink);
  min-width: 0;
}

.sb-pay-cost-breakdown-item-name i {
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.sb-pay-cost-breakdown-item-note {
  grid-column: 2 / -1;
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
}

.sb-pay-cost-breakdown-item-track {
  display: block;
  min-width: 0;
  height: 9px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--panel-2);
  overflow: hidden;
}

.sb-pay-cost-breakdown-item-fill {
  display: block;
  height: 100%;
  transition: width 0.3s var(--ease);
}

.sb-pay-cost-breakdown-item-val {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  text-align: right;
}

/* 三系列语义：teal = 给到人的钱，blue = 制度性支出，lime = 场地设备，coral = 最容易漏的隐性支出 */
.is-a {
  background: var(--accent);
}

.is-a2 {
  background: var(--accent);
  opacity: 0.45;
}

.is-b {
  background: var(--blue);
}

.is-b2 {
  background: var(--blue);
  opacity: 0.45;
}

.is-lime {
  background: var(--lime);
}

.is-c {
  background: var(--coral);
}

.sb-pay-cost-breakdown-sub-title {
  margin: 20px 0 8px;
  padding-top: 15px;
  border-top: 1px dashed var(--line-strong);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-pay-cost-breakdown-tiers {
  display: grid;
  gap: 7px;
}

.sb-pay-cost-breakdown-tier-row {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) 70px;
  align-items: center;
  gap: 10px;
}

.sb-pay-cost-breakdown-tier-name,
.sb-pay-cost-breakdown-tier-val {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.sb-pay-cost-breakdown-tier-val {
  text-align: right;
  color: var(--ink-2);
}

.sb-pay-cost-breakdown-tier-track {
  display: block;
  min-width: 0;
  height: 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
  overflow: hidden;
}

.sb-pay-cost-breakdown-tier-fill {
  display: block;
  height: 100%;
  background: var(--blue);
  opacity: 0.7;
  transition: width 0.3s var(--ease);
}

@media (max-width: 760px) {
  .sb-pay-cost-breakdown-plot {
    grid-template-columns: minmax(0, 1fr) 82px;
    gap: 8px;
  }

  .sb-pay-cost-breakdown-track {
    height: 42px;
  }

  /* 窄屏放不下段内文字：只读色块，明细在下面这张清单里 */
  .sb-pay-cost-breakdown-seg-label {
    display: none;
  }

  .sb-pay-cost-breakdown-item {
    grid-template-columns: 96px minmax(0, 1fr) 56px;
    gap: 8px;
  }

  .sb-pay-cost-breakdown-sum {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-pay-cost-breakdown-seg,
  .sb-pay-cost-breakdown-item-fill,
  .sb-pay-cost-breakdown-tier-fill,
  .sb-pay-cost-breakdown-tab {
    transition: none;
  }
}
</style>
