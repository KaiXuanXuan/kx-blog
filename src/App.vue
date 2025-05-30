<template>
  <header class="fixed w-full z-10 backdrop-blur-md">
    <Navigation />
  </header>
  <div class="pt-14 w-full h-full">
    <RouterView />
    <Toaster richColors />
  </div>
</template>

<script setup>
import { Toaster } from '@/components/ui/sonner';
import 'vue-sonner/style.css';
import Navigation from '@/components/myComponents/Navigation.vue';
</script>

<style scoped></style>
