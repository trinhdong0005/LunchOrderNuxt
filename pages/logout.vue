<template>

</template>

<script lang="ts">
export default {
  mounted: function () {
    localStorage.removeItem('access-token')
    localStorage.removeItem('fullname')
    this.$router.push({ path: '/' })
  }
}
</script>