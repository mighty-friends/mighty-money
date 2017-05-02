<template>
  <div>
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            마이티 채무 시스템
          </h1>
          <h2 class="subtitle">
            v0.1.0
          </h2>
        </div>
      </div>
    </section>
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <div class="tabs is-toggle is-fullwidth">
            <ul>
              <li :class="{ 'is-active': isList }">
                <a @click="view = 'list'">
                  <span class="icon is-small"><i class="fa fa-list"></i></span>
                  <span> 채무 </span>
                </a>
              </li>
              <li :class="{ 'is-active': isList }">
                <a @click="view = 'list'">
                  <span class="icon is-small"><i class="fa fa-list"></i></span>
                  <span> 거래 내역 </span>
                </a>
              </li>
              <li :class="{ 'is-active': isWon }">
                <a @click="view = 'won'">
                  <span class="icon is-small"><i class="fa fa-won"></i></span>
                  <span> 새 거래 </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <component :is="view"></component>
    </div>
  </div>

</template>

<script>
import list from './components/List.vue'
import won from './components/Won.vue'
export default {
  name: 'app',
  data: function () {
    return { view: 'list' }
  },
  computed: {
    isList: function () {
      return this.view === 'list'
    },
    isWon: function () {
      return this.view === 'won'
    }
  },
  components: {
    list, won
  }
}
</script>

<style scoped>
.container {
    padding: 1em;
}
</style>
