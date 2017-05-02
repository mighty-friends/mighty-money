<template lang="html">
  <div>
    <div class="field has-addons has-addons-centered">
      <p class="control">
        <span class="select">
          <select v-model="name">
            <option v-for="person in people"> {{ person }} </option>
          </select>
        </span>
      </p>
      <p class="control">
        <a class="button is-primary">
          의 채권
        </a>
      </p>
    </div>
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <table class="table is-striped">
          <thead>
            <tr>
              <th> 사람 </th>
              <th style="text-align:right"> 채권 </th>
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
            <tr v-if="credit!=0" v-for="(credit, name) in creditList(name)"
              :class="{'is-credit':credit>0, 'is-debt':credit<0}">
              <td> {{ name }} </td>
              <td class="amount has-text-right"> {{ credit | formatAmount }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'list',
  data: function () {
    return {
      trans: [],
      name: '김유진', // ::ISSUE:: Where to get default value
      people: [
        '김유진',
        '위재원',
        '이정재',
        '강명진'
      ]
    }
  },

  methods: {
    sumAmount: function (name) {
      let credit = this.trans
        .filter(e => e.creditor === name && e.valid === 1)
        .reduce((prev, curr) => {
          if (prev) return prev + curr.amount
          else return curr.amount
        }, 0)

      let debt = this.trans
        .filter(e => e.debtor === name && e.valid === 1)
        .reduce((prev, curr) => {
          if (prev) return prev + curr.amount
          else return curr.amount
        }, 0)

      return credit - debt
    },
    creditList: function (name) {
      let creditl = {}
      this.trans
        .filter(e => e.creditor === name && e.valid === 1)
        .filter(e => {
          if (creditl[e.debtor]) {
            creditl[e.debtor] += e.amount
            return false
          } else {
            creditl[e.debtor] = e.amount
            return true
          }
        })
      let debtl = {}
      this.trans
        .filter(e => e.debtor === name && e.valid === 1)
        .filter(e => {
          if (debtl[e.creditor]) {
            debtl[e.creditor] += e.amount
            return false
          } else {
            debtl[e.creditor] = e.amount
            return true
          }
        })

      for (var person in debtl) {
        if (creditl[person]) creditl[person] -= debtl[person]
        else creditl[person] = -debtl[person]
      }

      return creditl
    }
  },
  beforeMount: function () {
    let l = this
    this.$http.get('/api/trans')
      .then(function (response) {
        l.trans = response.data
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
