<template>
  <div class="flex items-center justify-center mt-3">

    <div class="grid grid-cols-1 gap-4 mt-3">
      <!-- Select menu div contains custom arrow -->
      <div
        class="relative mb-2 flex items-center after:w-[8px] after:h-[8px] after:border-black/70 after:border-b after:border-r after:transform after:rotate-45 after:absolute after:right-3">
        <!-- Select menu -->
        <select required
          class="text-black/70 bg-white px-3 py-2 transition-all cursor-pointer hover:border-blue-600/30 border border-gray-200 rounded-lg outline-blue-600/50 appearance-none invalid:text-black/30 w-64"
          v-model="selected.id">
          <option value="" disabled selected>Chọn</option>
          <template v-for="i in groups">
            <option :value="i.id">{{ i.name }}</option>
          </template>
        </select>
      </div>

      <input class="border-gray-200 w-64" type="datetime-local" required v-model="selected.date">

      <button class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full rounded"
        v-on:click="createGroup()">
        Tạo
      </button>
    </div>
  </div>
</template>


<script>
definePageMeta({
  middleware: 'auth'
});

export default {
  data() {
    return {
      groups: null,
      selected: {
        id: '',
        date: ''
      }
    }
  },
  mounted: async function () {
    this.groups = await this.getGroups()
  },
  methods: {
    async getGroups() {
      const { data, pending, error, refresh } = await this.$useApi('/GroupBuy/GetGroups', { method: 'GET' })
      return data
    },
    async createGroup() {
      if (!this.selected.id) {
        return
      }
      if (!Date.parse(this.selected.date)) {
        return
      }
      const body = {
        id: this.selected.id,
        date: new Date(this.selected.date)
      }
      const { data, pending, error, refresh } = await this.$useApi('/GroupBuy/OpenGroup', { method: 'POST', body })
      if (!error.value) {
        this.$toast.success('Mở order thành công!')
      } else {
        this.$toast.error('Mở order thất bại!')
      }
    }
  }
}
</script>
