<template>
  <div class="flex">
    <svg class="fill-current text-gray-600 w-3 cursor-pointer" viewBox="0 0 448 512" v-on:click="decrease()">
      <path
        d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
    </svg>

    <input class="mx-2 border text-center w-12" type="number" v-model="value" />

    <svg class="fill-current text-gray-600 w-3 cursor-pointer" viewBox="0 0 448 512" v-on:click="increase()">
      <path
        d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
    </svg>
  </div>
</template>


<script lang="ts">
export default {
  props: ['modelValue'],
  emits: ['update:modelValue', 'change'],
  computed: {
    value: {
      get() {
        return this.modelValue ? parseInt(this.modelValue) : 1
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    decrease() {
      if (this.value > 1) {
        this.value -= 1
      }
    },
    increase() {
      this.value += 1
    }
  },
  watch: {
    value: function (newVal, oldVal) {
      this.$emit('change', true)
    }
  }
}
</script>