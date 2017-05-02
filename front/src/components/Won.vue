<template lang="html">
  <div class="columns">
    <div class="column is-half is-offset-one-quarter">
      <transition name="fade">
        <notification
          v-if="sent"
          message="입력되었습니다"
          class="is-overlay is-success"></notification>
        <notification
          v-if="required"
          message="필요한 항목을 모두 채워주세요"
          class="is-overlay is-danger"></notification>
      </transition>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 빌려준 사람 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <span class="select">
                <select v-model="creditor" class="input" required>
                  <option value="" disabled selected> 채권자 </option>
                  <option v-for="person in people"> {{ person }} </option>
                </select>
              </span>
              <span class="icon is-small is-left">
                <i class="fa fa-user"></i>
              </span>
            </p>
          </div>

        </div>
      </div>

      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label"> 빌린 사람 </label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control has-icons-left">
              <span class="select">
                <select v-model="debtor" class="input" required>
                  <option value="" disabled selected> 채무자 </option>
                  <option v-for="person in people"> {{ person }} </option>
                </select>
              </span>
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
              <input v-model.number="amount"
                class="input"
                step="1000"
                type="number"
                placeholder="빌려준 돈의 양"
                style="width:50%"
                required>
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
    </div>
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
  props: ['people'],
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

      if (!this.people.includes(data.creditor) ||
        !this.people.includes(data.debtor) ||
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
