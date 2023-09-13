<template>
  <div class="pt-5 mx-10">
    <template v-for="i in results">
      <ul>
        <li class="list-disc mt-3">
          {{ i.users?.reduce((a, b) => a + b.qty, 0) }} {{ i.name }} - {{ i.unitName }} - {{ renderPrice(i.users?.reduce((a, b) => a + b.qty, 0) * i.price) }}
          <ul v-for="u in i.users">
            <li>- {{ u.fullName }} - {{ u.qty }} {{ i.unitName }} - {{ renderPrice(i.price * u.qty) }}</li>
          </ul>
        </li>
      </ul>
    </template>
    <div class="mt-5">
      <span >Tổng {{ getTotalQty() }} món: {{ getTotalAmt() }}</span>
    </div>

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3" v-on:click="copy()">
      Copy
    </button>
  </div>
</template>

<script>
definePageMeta({
  layout: 'none'
})

export default {
  data() {
    return {
      results: null
    }
  },
  mounted: async function () {
    this.results = await this.getResults(this.$route.query.id)
  },
  methods: {
    copy() {
      let str = ''
      for (const i of this.results) {
        const qty = i.users?.reduce((a, b) => a + b.qty, 0)
        str += `${qty} ${i.name} - ${i.unitName}\n`
      }
      navigator.clipboard.writeText(str)
    },
    renderPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
    getTotalAmt() {
      let amt = 0
      if (!this.results) {
        return this.renderPrice(amt)
      }
      for (const i of this.results) {
        amt += i.users?.reduce((a, b) => a + (b.qty * i.price), 0)
      }
      return this.renderPrice(amt)
    },
    getTotalQty() {
      let qty = 0
      if (!this.results) {
        return qty
      }
      for (const i of this.results) {
        if (i.users) {
          for (const u of i.users) {
            qty += u.qty
          }
        }
      }
      return qty
    },
    async getResults(id) {
      const { data, pending, error, refresh } = await this.$useApi('/Order/Result', { method: 'GET', params: { groupId: id } })
      return data
    }
  }
}
</script>