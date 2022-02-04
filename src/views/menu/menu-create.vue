<template>
  <div class="menu-create">
      <create-or-edit></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/CreateOrEdit.vue'
export default {
  name: 'MenuCreate',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>
</style>
