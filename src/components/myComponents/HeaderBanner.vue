<template>
  <!-- 顶部展示栏 -->
  <div class="mb-2 py-20 text-white text-center relative">
    <div class="absolute inset-0 w-full h-full bg-contain introduction-bg" style="background-image: url('/header.png')">
    </div>
    <div class="container mx-auto">
      <div class="text-white main-header-content">
        <h1 class="font-bold text-5xl mb-5">欢迎来到我的个人博客!</h1>
        <p class="w-full md:w-8/12 mx-auto">
          我是凯旋，一名前端开发者，正在努力学习和成长。
        </p>
      </div>
    </div>
    <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full" src="/introduction-music.png" />
  </div>
</template>

<script setup>

</script>

<style scoped>
.introduction-bg {
  animation: slide 50s linear infinite;
  will-change: background-position;
  z-index: -1;
}

@keyframes slide {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -4000px 0;
  }
}
</style>