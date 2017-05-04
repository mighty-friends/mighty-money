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
        <a class="button is-primary">
          의 거래
        </a>
      </p>
    </div>
    <div class="columns">
      <div class="column is-8 is-offset-2">
        <table class="table is-striped" >
          <thead class="is-hidden-mobile">
            <tr>
              <th> 수정 </th>
              <th> 날짜 </th>
              <th> 채권자 </th>
              <th> 채무자 </th>
              <th> 내역 </th>
              <th style="text-align:right"> 금액 </th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th colspan="6" style="text-align:center">
                현재 날짜 : {{ new Date().toISOString().slice(0,10) }}
              </th>
            </tr>
          </tfoot>
          <tbody>
            <tr v-for="ts in trans"
                v-if="related(ts)"
                :id=ts.id
                :title=ts.id
                :class="{
                  'invalid': !ts.valid,
                  'is-credit': ts.amount > 0,
                  'is-debt': ts.amount < 0}">
              <td class="is-hidden-mobile">
                <a class="button is-primary" id="copy" v-on:click="changeValid(ts)">
                  <span class="icon is-small">
                    <i class="fa fa-wrench"></i>
                  </span>
                </a>
              </td>
              <td class="is-hidden-mobile"> {{ ts.time }} </td>
              <td class="is-hidden-mobile"> {{ ts.creditor }} </td>
              <td class="is-hidden-mobile"> {{ ts.debtor }} </td>
              <td class="is-hidden-mobile"> {{ ts.description }} </td>
              <td class="amount is-hidden-mobile" style="text-align:right"> {{ ts.amount | formatAmount }} </td>
              <td colspan="5" class="is-hidden-tablet" style="padding-left:0;padding-right:0">
                <p class="is-small content" style="margin-bottom:0"> {{ts.time}} </p>
                {{merge(ts.creditor, '가')}}
                {{ts.debtor}}에게 {{ts.amount | formatAmount}} 빌려줌 <br>
                <p class="is-small content">{{ts.description}}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import postpos from 'kr-postposition'
export default {
  name: 'list',
  props: ['people'],
  data: function () {
    return {
      trans: [],
      name: '모두' // ::ISSUE:: Where to get default value
    }
  },
  methods: {
    merge: function (name, postposition) {
      return postpos.merge(name, postposition)
    },
    related: function (trans) {
      return this.name === '모두' ||
        trans.creditor === this.name ||
        trans.debtor === this.name
    },
    changeValid: function (trans) {
      if (confirm(trans.valid ? '거래를 취소하겠습니까?' : '거래를 복구하겠습니까?')) {
        let newvaild = 1 - trans.valid
        let url = '/api/trans?id=' + trans.id + '&valid=' + newvaild
        this.$http.put(url)
          .then(function (response) {
            trans.valid = newvaild
          })
          .catch(function (error) {
            console.log(error)
            alert((trans.vaild ? '거래 취소에 실패했습니다.' : '거래 복구에 실패했습니다.') + '개발자에게 문의해주세요.')
          })
      }
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
        alert('인터넷 연결 상태가 좋지 않거나, 데이터베이스에 문제가 생겼습니다. 개발자에게 문의해주세요.')
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
