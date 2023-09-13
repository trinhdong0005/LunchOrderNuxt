<template>
  <div class="flex items-center justify-center h-screen">
    <div>
      <div class="flex flex-col items-center space-y-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="text-green-600 w-28 h-28" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 class="text-4xl font-bold">Thank You!</h1>
        <template v-if="checkout?.qrImg">
          <p>Vui lòng chuyển khoản momo theo thông tin sau: </p>
          <nuxt-img :src="checkout?.qrImg" :alt="checkout?.receiveName" class="h-52 w-52 object-cover rounded-xl" loading="lazy"/>
          <h1>SĐT: {{ checkout?.phoneNumber }}</h1>
          <h1>Số tiền: {{ renderPrice(checkout?.cost || 0) }}</h1>
          <h2>Người nhận: {{ checkout?.receiveName }}</h2>
          <p>Nội dung: {{ checkout?.orderId }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: 'none'
})

export default {
  data() {
    return {
      checkout: null
    }
  },
  mounted: async function () {
    this.checkout = await this.getMomoQRCode()
    console.log(this.checkout)
  },
  methods: {
    async getMomoQRCode() {
      const { data, pending, error, refresh } = await this.$useApi(`/Checkout/GetMomoQRCode?orderId=${this.$route.query.id}`, { method: 'GET' })
      return data
    },
    renderPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    }
  }
}
</script>
