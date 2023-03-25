<script setup>

defineProps({
  msg: String,
  blocknodeName: String
})

</script>

<template>
  <div style="display: flex; padding: 12px 20px; border-bottom: 1px solid #aaa; align-items: center">
    <img style="width: 100px; margin-right: 16px" src="../assets/logo-tmp.png" />
    <div style="font-weight: 600; color: #111; font-size: 18px; margin-right: 12px;">科研原始数据存证平台</div>
    <div style="background-color: #eee; color: #222; padding: 4px 8px; font-size: 13px; border-radius: 6px;">{{blocknodeName}}</div>
  </div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
