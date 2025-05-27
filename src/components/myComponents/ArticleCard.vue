<template>
  <Card class="p-6 rounded-sm">
    <div class="flex gap-4">
      <img :src="cover" class="w-32 h-32 rounded-lg object-cover" />
      <div class="flex-1">
        <h2 class="text-xl font-bold mb-2">{{ title }}</h2>
        <p class="text-gray-600 mb-4 line-clamp-3">{{ summary }}</p>
        <div class="flex items-center text-sm text-gray-500">
          <span>{{ date }}</span>
          <span class="mx-2">•</span>
          <span>10分钟阅读</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Card } from '@/components/ui/card';
defineProps({
  title: String,
  summary: String,
  date: String,
  cover: String
})
</script>