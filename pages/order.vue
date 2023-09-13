<template>
  <div class="text-center p-10" v-if="isOpen">
    <h1 class="font-bold text-4xl mb-4">Đang mở order: {{ order?.name || '...' }}</h1>
    <h1 class="text-3xl">{{ countdown || '...' }}</h1>
  </div>
  <div class="text-center p-10" v-else>
    <h1 class="font-bold text-4xl mb-4">Hiện tại không mở order</h1>
  </div>

  <section
    class="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
    v-if="isOpen"
  >
    <template v-for="item in foods">
      <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
        <nuxt-img :src="item.imageUrl ?? '/img/noimg.jpg'" :alt="item.foodName" class="h-80 w-72 object-cover rounded-t-xl" loading="lazy"/>
        <div class="px-4 py-3 w-72">
          <span class="text-gray-400 mr-3 uppercase text-xs">{{ item.brandName }}</span>
          <p class="text-lg font-bold text-black truncate block capitalize">{{ item.foodName }}</p>

          <div class="my-3">
            <template v-for="u in item.units">
              <div class="flex items-center mr-4 mb-2">
                <a href="#">
                  <input :id="item.foodId + u.unitId" type="radio" :name="item.foodId" :value="u.unitId"
                    v-model="item.unitIdPicked" class="hidden" />
                  <label :for="item.foodId + u.unitId" class="flex items-center cursor-pointer">
                    <span class="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                    {{ u.name }} - {{ renderPrice(u.price) }}
                  </label>
                </a>
              </div>
            </template>
          </div>

          <div class="flex mt-5 mb-2 px-5 items-end">
            <CounterButton v-model="item.qty" />
            <div class="ml-auto">
              <div class="cursor-pointer" v-on:click="addItemToCart(item.foodId, item.unitIdPicked, item.qty ?? 1)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bag-plus"
                  viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                    d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                  <path
                    d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>




<script>
definePageMeta({
  middleware: 'auth'
});

export default {
  data() {
    return {
      order: null,
      countdown: null,
      foods: null,
      basketQty: useBasketQty(),
      isOpen: false
    }
  },
  mounted: async function () {
    await nextTick()
    this.order = await this.getOpenOrder()
    const now = new Date();
    if (this.order?.id && this.order?.endTime && new Date(this.order.endTime).getTime() >= now.getTime()) {
      localStorage.setItem('groupId', this.order?.id)
      this.isOpen = true
    } else {
      localStorage.removeItem('groupId')
      this.isOpen = false
    }
    this.startTimer(this.order?.endTime)
    this.foods = await this.getFoods(this.order?.id)
  },
  methods: {
    renderPrice(price) {
      return price.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    },
    startTimer(date) {
      const countDownDate = new Date(date).getTime()
      const x = setInterval(() => {
        const now = new Date().getTime()
        const distance = countDownDate - now
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        this.countdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        if (distance < 0) {
          clearInterval(x)
          this.countdown = '00:00:00'
        }
      }, 1000);
    },
    async getOpenOrder() {
      const { data, pending, error, refresh } = await this.$useApi('/GroupBuy/GetOpenOrder', { method: 'GET' })
      return data
    },
    async getFoods(id) {
      const { data, pending, error, refresh } = await this.$useApi('/GroupBuy/GetFoods', {
        method: 'GET',
        params: { id: id }
      })
      return data
    },
    async addItemToCart(foodId, unitId, qty) {
      if (!foodId || !unitId || !qty || qty < 1) {
        return
      }
      const body = {
        groupId: this.order?.id,
        items: [
          {
            foodId: foodId,
            unitId: unitId,
            qty: qty
          }
        ]
      }
      const { data, pending, error, refresh } = await this.$useApi('/Basket/AddToBasket', { method: 'POST', body })
      if (!error.value) {
        this.basketQty += qty
        this.$toast.success('Thêm vào giỏ hàng thành công!')
      }
    }
  }
}
</script>
