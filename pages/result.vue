<template>
  <div class="pt-10 mx-10">
    <template v-for="i in histories">
      <NuxtLink :to="`/result-detail?id=${i.id}`">{{ i.id }} - {{ i.name }} - {{ i.endTime }}</NuxtLink><br>
    </template>
  </div>
</template>

<script>
definePageMeta({
  layout: 'none'
})

export default {
  data() {
    return {
      histories: null
    }
  },
  mounted: async function () {
    this.histories = await this.getHistories()
  },
  methods: {
    async getHistories() {
      const { data, pending, error, refresh } = await this.$useApi('/GroupBuy/GetHistories', { method: 'GET' })
      return data
    }
  }
}
</script>
