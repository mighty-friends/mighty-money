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
          의 채무
        </a>
      </p>
    </div>
    <div v-if="name === '모두'" class="columns">
      <div class="column is-8 is-offset-2">
        <table class="table is-striped" >
          <thead>
            <tr>
              <th> 채권자 </th>
              <th> 채무자 </th>
              <th> 금액 </th>
              <th> 날짜 </th>
              <th> 내역 </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colspan="3"> 현재 일시 </th>
              <th colspan="2"> {{ new Date().toISOString().slice(0,10) }} </th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="ts in trans"
                :id=ts.id
                :title=ts.id
                :class="{
                  'invalid': !ts.valid,
                  'is-credit': ts.amount > 0,
                  'is-debt': ts.amount < 0}">
              <td> {{ ts.creditor }} </td>
              <td> {{ ts.debtor }} </td>
              <td class="amount"> {{ ts.amount }} </td>
              <td> {{ ts.time }} </td>
              <td> {{ ts.description }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="columns">
      <div class="column is-half is-offset-one-quarter">
        <table class="table is-striped">
          <thead>
            <tr>
              <th class="is-credit"> 채권 </th>
              <th> 사람 </th>
              <th class="is-debt"> 채무 </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colspan="2"> 총계 </th>
              <th> {{ sumAmount(name) }} </th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="(credit, name) in creditList(name)"
              :class="{'is-credit':credit>0, 'is-debt':credit<0}">
              <td class="amount" v-if="credit>0"> {{ credit }} </td>
              <td v-else></td>
              <td> {{ name }} </td>
              <td class="amount" v-if="credit<0"> {{ -credit }}</td>
              <td v-else></td>
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
      name: '모두', // ::ISSUE:: Where to get default value
      people: [
        '모두',
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
