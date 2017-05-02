<template lang="html">
  <div>
    <div class="field has-addons has-addons-centered">
      <p class="control">
        <span class="select">
          <select v-model="name">
            <option value="모두"> 모두 </option>
            <option v-for="person in people"> {{ person }} </option>
          </select>
        </span>
      </p>
      <p class="control">
        <a class="button is-primary" id="copy">
          <span> 의 채권 </span>
          <span class="icon is-small">
            <i class="fa fa-copy"></i>
          </span>
        </a>
      </p>
    </div>

    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <table v-if="name === '모두'" class="table is-striped">
          <thead>
            <tr>
              <th> 채권자 </th>
              <th> 채무자 </th>
              <th colspan="2" style="text-align:right"> 채권액 </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in this.credit"
                v-if="e.amount > 0"
                class="is-credit">
              <td> {{ e.creditor }} </td>
              <td> {{ e.debtor }} </td>
              <td class="amount" colspan="2" style="text-align:right"> {{ e.amount | formatAmount }} </td>
            </tr>
          </tbody>
        </table>
        <table class="table is-striped" v-else>
          <thead>
            <tr>
              <th> 사람 </th>
              <th style="text-align:right"> 채권액 </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th> 총계 </th>
              <th style="text-align:right">
                {{ sumAmount(name) | formatAmount }}
              </th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="e in this.credit"
                v-if="e.creditor === name & e.amount != 0"
                :class="{
                  'is-credit': e.amount > 0,
                  'is-debt': e.amount < 0}">
              <td> {{ e.debtor }} </td>
              <td class="amount" style="text-align:right"> {{ e.amount | formatAmount }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

const cp = new Clipboard('#copy')

cp.on('success', function (e) {
  console.info('Action:', e.action)
  console.info('Text:', e.text)
  console.info('Trigger:', e.trigger)

  e.clearSelection()
})

export default {
  name: 'list',
  props: ['people'],
  data: function () {
    return {
      credit: [],
      name: '모두' // ::ISSUE:: Where to get default value
    }
  },

  methods: {
    sumAmount: function (name) {
      let amount = this.credit
        .filter(e => e.creditor === name)
        .reduce((prev, curr) => {
          if (prev) return prev + curr.amount
          else return curr.amount
        }, 0)

      return amount
    }
  },
  beforeMount: function () {
    let l = this
    this.$http.get('/api/credit')
      .then(function (response) {
        l.credit = response.data
      })
      .catch(function (error) {
        console.log(error)
        alert('인터넷 연결 상태가 좋지 않거나, 데이터베이스에 문제가 생겼습니다. 개발자에게 문의해주세요')
      })
  },
  filters: {
    formatAmount: function (amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '원'
    }
  }

}
</script>

<style lang="css">

    .is-credit>.amount {
        color: green;
    }

    .is-debt>.amount {
        color: red;
    }

    .invalid {
        text-decoration: line-through;
        color: red;
    }

</style>
