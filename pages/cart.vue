<template>
  <div class="container mx-auto pt-10">
    <div class="grid grid-cols-4 shadow-md">
      <div class="col-span-4 lg:col-span-3 bg-white px-10 py-10">
        <div class="flex justify-between border-b pb-8">
          <h1 class="font-semibold text-2xl">Giỏ hàng</h1>
          <h2 class="font-semibold text-2xl">{{ this.basketQty }} món</h2>
        </div>
        <div class="flex mt-10 mb-5">
          <h3 class="font-semibold text-gray-600 text-xs uppercase w-2/5">Sản phẩm</h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Số lượng</h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Giá</h3>
          <h3 class="font-semibold text-center text-gray-600 text-xs uppercase w-1/5">Tổng</h3>
        </div>
        <div class="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5" v-for="i in baskets">
          <div class="flex w-2/5"> <!-- product -->
            <div class="w-20">
              <nuxt-img class="h-24 object-cover" :src="i.imageUrl ?? '/img/noimg.jpg'" :alt="i.name" loading="lazy"/>
            </div>
            <div class="flex flex-col justify-between ml-4 flex-grow">
              <span class="font-bold text-sm">{{ i.name }} - {{ i.unitName }}</span>
              <span class="text-red-500 text-xs">{{ i.branchName }}</span>
              <a href="#" class="font-semibold hover:text-red-500 text-gray-500 text-xs"
                v-on:click="deleteItem(i)">Xóa</a>
            </div>
          </div>
          <div class="flex justify-center w-1/5">
            <CounterButton v-model="i.qty" v-on:change="qtyOnChange" />
          </div>
          <span class="text-center w-1/5 font-semibold text-sm">{{ renderPrice(i.price) }}</span>
          <span class="text-center w-1/5 font-semibold text-sm">{{ renderPrice(i.price * i.qty) }}</span>
        </div>

        <div v-on:click="back" class="flex font-semibold text-indigo-600 text-sm mt-10 cursor-pointer">
          <svg class="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
            <path
              d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
          </svg>
          Quay lại
        </div>
      </div>

      <div class="col-span-4 lg:col-span-1 px-8 py-10 bg-[#f6f6f6]">
        <h1 class="font-semibold text-2xl border-b pb-8">Order Summary</h1>
        <div class="flex font-semibold justify-between py-6 text-sm uppercase border-b">
          <span>Họ tên</span>
          <span>{{ fullname }}</span>
        </div>
        <div class="mt-8">
          <div class="flex font-semibold justify-between py-6 text-sm uppercase">
            <span>Tổng</span>
            <span>{{ getTotalCost() }}</span>
          </div>
          <button class="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
            v-on:click="checkout()">
            Đặt
          </button>
        </div>
      </div>

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
      groupId: '',
      basketQty: useBasketQty(),
      baskets: null,
      fullname: ''
    }
  },
  mounted: async function () {
    this.fullname = localStorage.getItem('fullname')
    this.groupId = localStorage.getItem('groupId')
    await nextTick()
    this.baskets = await this.getBaskets(this.groupId)
  },
  methods: {
    renderPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
    qtyOnChange(event) {
      if (!event) {
        return
      }
      const newQty = this.baskets.reduce((a, b) => a + parseInt(b.qty), 0)
      this.basketQty = newQty
    },
    getTotalCost() {
      const total = this.baskets?.reduce((a, b) => a + (b.price * b.qty), 0)
      return this.renderPrice(total ?? 0)
    },
    async back() {
      if (!this.groupId) {
        this.$router.push({ path: 'order' })
        return
      }
      this.baskets = await this.updateBasket(this.groupId)
      this.$router.push({ path: 'order' })
    },
    async checkout() {
      if (this.basketQty < 1) {
        this.$toast.error('Giỏ hàng trống!')
        return
      }
      this.baskets = await this.updateBasket(this.groupId)
      const { data, pending, error, refresh } = await this.$useApi('/Order/Submit', { method: 'POST', params: { groupId: this.groupId } })
      if (!error.value && data.value.id) {
        this.$router.push({ path: 'success', query: { id: data.value.id }})
        this.$toast.success('Đặt hàng thành công')
      } else {
        this.$toast.error('Đặt hàng thất bại')
      }
    },
    async deleteItem(item) {
      const body = {
        groupId: this.groupId,
        items: [item]
      }
      const { data, pending, error, refresh } = await this.$useApi('/Basket/RemoveItems', { method: 'DELETE', body })
      if (!error.value) {
        this.baskets = data
        this.basketQty -= item.qty
        this.$toast.success('Xóa sản phẩm thành công')
      }
    },
    async getBaskets(groupId) {
      if (groupId) {
        const { data, pending, error, refresh } = await this.$useApi('/Basket', { method: 'GET', params: { groupId } })
        return data
      }
    },
    async updateBasket(groupId) {
      const body = {
        groupId,
        items: this.baskets.map(obj => ({ foodId: obj.foodId, unitId: obj.unitId, qty: obj.qty }))
      }
      const { data, pending, error, refresh } = await this.$useApi('/Basket/UpdateBasket', { method: 'POST', body })
      return data
    }
  }
}
</script>
