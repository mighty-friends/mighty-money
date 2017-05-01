<template lang="html">
  <div class="columns">
    <form class="column is-half is-offset-one-quarter">
      <transition name="fade">
        <notification
          v-if="sent"
          message="입력되었습니다"
          class="is-overlay is-success"></notification>
        <notification
          v-if="required"
          message="실명과 금액을 입력하세요"
          class="is-overlay is-danger"></notification>
      </transition>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 채권자 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <input v-model.trim="creditor" class="input" type="text" placeholder="채권자 이름" required>
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </p>
          </div>

        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 채무자 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <input v-model.trim="debtor" class="input" type="text" placeholder="채무자 이름" required>
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 돈 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <input v-model.number="amount" class="input" type="number" placeholder="빌려준 돈의 양" required>
              <span class="icon is-small is-left">
                <i class="fa fa-money"></i>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 설명 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <input v-model.trim="description" class="input" type="text" placeholder="거래에 대한 설명" required>
              <span class="icon is-small is-left">
                <i class="fa fa-info"></i>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label"></div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <button class="button is-primary" @click="insert()">
                채무 입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

var Notification = {
  props: ['message'],
  template:
`<div class="notification">
  <button class="delete" @click=""></button>
  {{message}}
</div>`
}

export default {
  name: 'won',
  data: function () {
    return {
      creditor: '',
      debtor: '',
      amount: '',
      description: '',
      sent: false,
      required: false
    }
  },
  methods: {
    insert: function () {
      let data = {
        creditor: this.creditor,
        debtor: this.debtor,
        amount: this.amount,
        description: this.description
      }
      let state = this

      var people = new RegExp(/(김유진|위재원|이정재|강명진)/)
      if (!people.test(data.creditor) ||
        !people.test(data.debtor) ||
        !Number.isInteger(data.amount)) {
        state.required = true
        setTimeout(() => {
          state.required = false
        }, 3000)
        return
      }

      let url = `/api/trans?creditor=${this.creditor}&debtor=${this.debtor}&amount=${this.amount}&description=${this.description}`
      this.$http.post(url, data)
        .then(function (response) {
          state.sent = true
          state.debtor = ''
          setTimeout(() => {
            state.sent = false
          }, 3000)
        })
        .catch(function (error) {
          console.log(error)
          alert('인터넷 연결 상태가 좋지 않거나, 데이터베이스에 문제가 생겼습니다. 개발자에게 문의해주세요')
        })
    }
  },
  components: {
    notification: Notification
  }
}
</script>

<style lang="css">
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0
  }
</style>
