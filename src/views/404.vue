<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>抱歉，您访问的页面不存在。</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script setup>
// 这里无需额外脚本
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f8f8;
}
h1 {
  font-size: 8rem;
  margin: 0;
  color: #e57373;
}
p {
  font-size: 1.5rem;
  color: #666;
  margin: 16px 0 32px 0;
}
.home-link {
  display: inline-block;
  padding: 10px 24px;
  background: #6874e8;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.2s;
}
.home-link:hover {
  background: #7782ea;
}
</style>
