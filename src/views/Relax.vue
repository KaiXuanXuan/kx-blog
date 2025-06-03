<template>
  <div>
    Test
  </div>
</template>
<script setup>
import {getHotSearch} from '@/api/relax'
import {onMounted, ref} from 'vue'

const hotSearchList = ref([])

onMounted(async()=>{
  const res = await getHotSearch()
  hotSearchList.value = res.data
  console.log(hotSearchList.value)
})

</script>
<style scoped>
  
</style>