<script setup lang="ts">
// /ready/exit-plan 的四条散伙条款：只给结构，不给金额模板。
// 每张卡左边写"要写清楚什么"，右边写"没写这条的真实代价"。

interface Clause {
  no: string
  title: string
  scope: string
  write: string[]
  cost: string
}

const CLAUSES: Clause[] = [
  {
    no: '01',
    title: '分手价怎么定',
    scope: '估值方法，不是谁嗓门大',
    write: [
      '按什么口径算：近 12 个月毛利的倍数、第三方评估、还是一人出价另一人选择。',
      '谁有优先买、谁有优先卖，付不起全款时分几年付清。'
    ],
    cost: '赚钱那天开始吵架。最后通常是现金流厚的那位说了算，你那份被压成一个数字——而这数字是你自己没写清楚的。'
  },
  {
    no: '02',
    title: '谁有权让谁走',
    scope: '回购权与触发条件',
    write: [
      '哪些情形可以要求对方退股：连续多少个月不参与经营、长期失联、重病、去世、离婚。',
      '回购价从哪来、钱从哪来、分几期付；人走了股权什么时候真的走完手续。'
    ],
    cost: '人不干活的第二年，股还挂在他名下。每件小事都要"再谈一次"，公司慢慢变成一个只会开会的地方。'
  },
  {
    no: '03',
    title: '散伙后还能不能做这行',
    scope: '竞业与客户名单',
    write: [
      '多长时间内、多大范围内不再做同一块业务，对应补偿怎么给——限制和补偿要互相对等。',
      '客户名单、供应商关系、店铺位置这些归谁；具体边界与补偿口径以当地当年规定为准。'
    ],
    cost: '你带着老客户另起一家，对方一句"你在抢我的生意"，两个本来还能活的小生意一起进调解室，时间和精力全交代在证明"我先做的"上面。'
  },
  {
    no: '04',
    title: '债务与担保谁背',
    scope: '个人担保不会因为散伙消失',
    write: [
      '公司欠款、欠税、未结的社保与员工补偿怎么分，谁来负责结清。',
      '你个人签过的担保、抵押由谁在什么时限内换掉；注销手续谁去跑、跑不完谁担。'
    ],
    cost: '公司注销了，银行和税务还认你的名字。这条最容易被跳过，因为签的时候大家都觉得"不会有事"，出事时它排在第一行。'
  }
]
</script>

<template>
  <div class="sb-exit-clause-cards sb-widget" data-listen="skip">
    <div class="sb-widget-head">
      <span class="sb-widget-title">Exit Clauses · 散伙前该写清哪四件事</span>
      <p class="sb-widget-sub">在最和气的时候写，才是这四张卡唯一的用法。</p>
    </div>

    <figure class="sb-exit-clause-cards-fig">
      <ul class="sb-exit-clause-cards-grid">
        <li v-for="c in CLAUSES" :key="c.no" class="sb-exit-clause-cards-card">
          <div class="sb-exit-clause-cards-head">
            <span class="sb-exit-clause-cards-no">{{ c.no }}</span>
            <span class="sb-exit-clause-cards-title">{{ c.title }}</span>
            <span class="sb-exit-clause-cards-scope">{{ c.scope }}</span>
          </div>

          <div class="sb-exit-clause-cards-pair">
            <div class="sb-exit-clause-cards-write">
              <span class="sb-exit-clause-cards-tag">写清楚</span>
              <p v-for="(w, i) in c.write" :key="`${c.no}-w-${i}`" class="sb-exit-clause-cards-wline">
                {{ w }}
              </p>
            </div>
            <div class="sb-exit-clause-cards-cost">
              <span class="sb-exit-clause-cards-tag">没写这条的真实代价</span>
              <p class="sb-exit-clause-cards-ctext">{{ c.cost }}</p>
            </div>
          </div>
        </li>
      </ul>

      <span class="sr-only">
        四张条款卡，每张上半句写要写清楚什么，下半句写没写这条的真实代价。第一张，分手价怎么定：
        约定按什么口径估值、谁有优先买卖、付不起时分几年付清；不写的代价是赚钱那天开始吵架，
        最后由现金流厚的一方定价。第二张，谁有权让谁走：约定回购权和触发条件，比如连续多少个月
        不参与经营、长期失联、重病、去世、离婚，以及回购钱从哪来、分几期；不写的代价是人不干活了
        股还在他名下，每个决定都要再谈一次。第三张，散伙后还能不能做这行：约定竞业的时限与范围、
        对应补偿怎么给、客户名单和供应商关系归谁，具体口径以当地当年规定为准；不写的代价是散伙后
        互相指控抢生意，两笔生意一起耗在调解上。第四张，债务与担保谁背：约定公司欠款、欠税、
        未结社保与员工补偿怎么分，个人签过的担保和抵押由谁在什么时限内换掉，注销手续谁去跑；
        不写的代价是公司注销了，银行和税务还认你这个人。这四条只给结构，不给金额模板，
        要在开工前找律师落成书面。
      </span>
    </figure>

    <p class="sb-cap">
      四张卡的顺序是<b>价格 · 去留 · 竞业 · 债务</b>，最常被跳过的是第四张——
      <b>公司能注销，你签的个人担保注销不了</b>。这里只给结构，不给金额模板：具体怎么写、
      怎么写才有效，<b>开工前找律师落成书面</b>，涉及法律与税务的部分以当地当年口径为准。
      写在和气的时候便宜，写在翻脸的时候贵。
    </p>
  </div>
</template>

<style scoped>
.sb-exit-clause-cards-fig {
  margin: 0;
}

.sb-exit-clause-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.sb-exit-clause-cards-card {
  display: grid;
  gap: 10px;
  min-width: 0;
  padding: 13px 14px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--panel-2);
}

.sb-exit-clause-cards-head {
  display: grid;
  gap: 2px;
  padding-bottom: 9px;
  border-bottom: 1px dashed var(--line-strong);
}

.sb-exit-clause-cards-no {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.14em;
  color: var(--faint);
}

.sb-exit-clause-cards-title {
  font-size: 13.5px;
  font-weight: 680;
  line-height: 1.4;
  color: var(--ink);
  overflow-wrap: anywhere;
}

.sb-exit-clause-cards-scope {
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 1.5;
  letter-spacing: 0.06em;
  color: var(--muted);
  overflow-wrap: anywhere;
}

.sb-exit-clause-cards-pair {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.sb-exit-clause-cards-write,
.sb-exit-clause-cards-cost {
  min-width: 0;
}

.sb-exit-clause-cards-cost {
  padding: 9px 10px;
  border: 1px dashed var(--coral);
  border-radius: var(--radius-sm);
  background: var(--coral-soft);
}

.sb-exit-clause-cards-tag {
  display: block;
  margin-bottom: 5px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.12em;
  color: var(--faint);
}

.sb-exit-clause-cards-cost .sb-exit-clause-cards-tag {
  color: var(--coral);
}

.sb-exit-clause-cards-wline {
  margin: 0 0 6px;
  padding-left: 11px;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-2);
  border-left: 1px solid var(--accent);
  overflow-wrap: anywhere;
}

.sb-exit-clause-cards-wline:last-child {
  margin-bottom: 0;
}

.sb-exit-clause-cards-ctext {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  /* 窄屏一列一卡：每张卡的"写清楚 / 代价"仍是上下读，不用左右扫 */
  .sb-exit-clause-cards-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .sb-exit-clause-cards-card {
    padding: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .sb-exit-clause-cards-card {
    transition: none;
  }
}
</style>
