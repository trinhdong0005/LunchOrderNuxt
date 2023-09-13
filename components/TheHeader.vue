<template>
  <div class="flex-1 flex flex-col">
    <nav class="px-4 flex justify-between bg-white h-16 border-b-2">
      <!-- top bar left -->
      <ul class="flex items-center">
        <!-- add button -->
        <!-- <li class="h-6 w-6">
        <img class="h-full w-full mx-auto"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/512px-Svelte_Logo.svg.png"
          alt="svelte logo" />
      </li> -->
      </ul>

      <ul class="flex items-center">
        <!-- add button -->
        <!-- <li>
        <h1 class="pl-8 lg:pl-0 text-gray-700">Svelte</h1>
      </li> -->
      </ul>

      <!-- to bar right  -->
      <ul class="flex items-center">
        <li class="font-sans block mt-4 lg:inline-block lg:mt-0 lg:ml-6 align-middle text-black hover:text-gray-700 mr-3">
          <NuxtLink to="cart" role="button" class="relative flex">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="flex-1 w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>

            <span
              class="absolute right-0 top-0 rounded-full bg-red-600 w-4 h-4 top right p-0 m-0 text-white font-mono text-sm leading-tight text-center">
              {{ qty > 99 ? '+' : qty }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      qty: useBasketQty()
    }
  },
  mounted: async function() {
    this.qty = await this.getBasketQty()
  },
  methods: {
    async getBasketQty() {
      const groupId = localStorage.getItem('groupId')
      if (!groupId) {
        return 0
      }
      const { data, pending, error, refresh } = await this.$useApi('/Basket/GetBasketQty', { 
        method: 'GET',
        params: {
          groupId
        }
      })
      return data.value ?? 0
    }
  }
}
</script>
