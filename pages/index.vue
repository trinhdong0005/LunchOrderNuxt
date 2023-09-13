<template>
  <div class="flex h-screen">
    <div class="m-auto grid justify-items-center">
      <div class="group w-72">
        <label for="fullname"
          class="block w-full pb-1 ml-5 text-sm font-medium text-gray-500 transition-all duration-200 ease-in-out group-focus-within:text-blue-500">
          Vui lòng nhập họ tên
        </label>
        <input type="text" id="fullname" name="fullname" placeholder="John Wick"
          class="peer h-10 w-full rounded-full bg-white-500 ring-2 ring-blue-300 px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-white focus:ring-2 focus:ring-blue-500"
          v-model="fullname">
      </div>
      <button
        class="rounded-full px-4 py-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-blue-100 duration-300 mt-5"
        v-on:click="nextStep()">Tiếp theo</button>
    </div>
  </div>
</template>

<script lang="ts">
definePageMeta({
  layout: 'none'
})

export default {
  data() {
    return {
      fullname: ''
    }
  },
  mounted: function () {
    const name = localStorage.getItem('fullname')
    const token = localStorage.getItem('access-token')
    if (name && token) {
      this.$router.push({ path: 'order' })
    }
  },
  methods: {
    async nextStep() {
      if (this.fullname.length < 1) {
        this.$toast.error('Vui lòng nhập họ tên')
        return
      }
      const { data, pending, error, refresh } = await this.$useApi('/Auth/Login', { 
        method: 'POST',
        body: {
          fullname: this.fullname
        }
      })
      localStorage.setItem('access-token', data.value.accessToken)
      localStorage.setItem('fullname', this.fullname)
      this.$router.push({ path: 'order' })
    }
  }
}
</script>