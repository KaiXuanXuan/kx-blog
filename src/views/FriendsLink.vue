<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- 搜索框 -->
    <div class="mb-8">
      <Input v-model="searchKeyword" placeholder="搜索友情链接..." class="w-full max-w-2xl mx-auto" />
    </div>

    <!-- 收藏夹列表 -->
    <div class="space-y-4">
      <Collapsible v-for="(folder, index) in folders" :key="index" v-model:open="folder.isOpen" class="border rounded-lg">
        <CollapsibleTrigger class="cursor-pointer flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800">
          <div class="flex items-center gap-2">
            <div class="h-5 w-5 flex items-center">{{ folder.isOpen ? '📂' : '📁' }}</div>
            <span class="text-lg font-medium">{{ folder.title }}</span>
          </div>
          <CollapsibleButton class="text-gray-500">
            {{ folder.isOpen ? '折叠' : '展开' }}
          </CollapsibleButton>
        </CollapsibleTrigger>

        <CollapsibleContent class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <LinkCard v-for="(item, itemIdx) in folder.items" :key="itemIdx" :item="item" :delay="itemIdx * 0.1" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import LinkCard from '@/components/myComponents/LinkCard.vue';
import { gsap } from 'gsap';

// 搜索关键词
const searchKeyword = ref('');

// 模拟收藏夹数据
const folders = ref([
  {
    title: '技术社区',
    isOpen: true,
    items: [
      { icon: '🔗', title: 'Vue官方文档', desc: 'Vue.js 渐进式JavaScript框架文档' },
      { icon: '🔗', title: 'React官方文档', desc: 'React 用于构建用户界面的JavaScript库' },
      { icon: '🔗', title: 'TypeScript文档', desc: 'JavaScript的类型超集' },
      { icon: '🔗', title: 'TypeScript文档', desc: 'JavaScript的类型超集' },
      { icon: '🔗', title: 'TypeScript文档', desc: 'JavaScript的类型超集' },
    ],
  },
  {
    title: '设计资源',
    isOpen: false,
    items: [
      { icon: '🎨', title: 'Dribbble', desc: '全球设计师作品分享平台' },
      { icon: '🎨', title: 'Behance', desc: 'Adobe旗下创意作品分享社区' },
    ],
  },
]);

// 折叠按钮组件（shadcn需要自定义触发文本）
const CollapsibleButton = {
  props: ['isOpen'],
  template: "<span>{{ isOpen ? '折叠' : '展开' }}</span>",
};
</script>

<style scoped>
</style>
