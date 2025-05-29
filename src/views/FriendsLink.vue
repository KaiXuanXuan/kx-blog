<template>
  <div class="max-w-7xl mx-auto px-4 py-8 center">
    <!-- 搜索框 -->
    <div class="flex justify-center">
      <div class="relative w-full max-w-lg items-center mb-8">
        <Input id="search" type="text" placeholder="搜索..." class="pl-10" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
    </div>

    <!-- 按钮列表 -->
    <Dialog v-model:open="folderForm.open">
      <DialogTrigger asChild class="mr-4">
        <Button class="mb-4">添加收藏夹</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加收藏夹</DialogTitle>
          <DialogDescription>请输入收藏夹名称</DialogDescription>
        </DialogHeader>

        <Input v-model="folderForm.title" placeholder="收藏夹名称" class="mb-4" />
        <DialogFooter>
          <Button class="w-full" @click="addFolder">确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="itemForm.open">
      <DialogTrigger asChild>
        <Button class="mb-4">添加网站</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加网站</DialogTitle>
          <DialogDescription>请输入网站信息</DialogDescription>
        </DialogHeader>
        <Select v-model="itemForm.categoryId" placeholder="选择分类" class="mb-4">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">技术社区</SelectItem>
            <SelectItem value="2">学习资源</SelectItem>
            <SelectItem value="3">工具网站</SelectItem>
          </SelectContent>
        </Select>

        <Input v-model="itemForm.title" placeholder="网站名称" class="" />
        <Input v-model="itemForm.item_desc" placeholder="网站描述" class="" />
        <Input v-model="itemForm.item_url" placeholder="网站地址" class="" />
        <Input placeholder="网站图标" type="file" @change="changeIcon" class="" />
        <img :src="itemForm.icon" ></img>

        <DialogFooter>
          <Button class="w-full" @click="addItem">确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

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
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-vue-next';
import LinkCard from '@/components/myComponents/LinkCard.vue';
import {
  addResourceCategory,
  getResourceCategories,
  updateResourceCategory,
  deleteResourceCategory,
  addResourceItem,
  getItemsByCategory,
  updateResourceItem,
  deleteResourceItem,
  searchResources,
} from '@/api/resource';
import { gsap } from 'gsap';
import { toast } from 'vue-sonner';

// 搜索关键词
const searchKeyword = ref('');
// 收藏夹新增表单
const folderForm = ref({
  open: false,
  title: '',
});
// 收藏夹中项目新增表单
const itemForm = ref({
  open: false,
  title: '',
  item_desc:'',
  item_url: '',
  categoryId: 0,
  icon: '',
  iconType: '',
  iconName: '',
});
// 收藏夹列表
const folders = ref([
  {
    title: '技术社区',
    isOpen: true,
    items: [
      { icon: '🔗', title: 'Vue官方文档', item_desc: 'Vue.js 渐进式JavaScript框架文档', item_url: 'https://vuejs.org' },
      { icon: '🔗', title: 'React官方文档', item_desc: 'React 用于构建用户界面的JavaScript库', item_url: 'https://react.dev' },
      { icon: '🔗', title: 'TypeScript文档', item_desc: 'JavaScript的类型超集', item_url: 'https://www.typescriptlang.org' },
      { icon: '🔗', title: 'TypeScript文档', item_desc: 'JavaScript的类型超集', item_url: 'https://www.typescriptlang.org' },
      { icon: '🔗', title: 'TypeScript文档', item_desc: 'JavaScript的类型超集', item_url: 'https://www.typescriptlang.org' },
    ],
  },
  {
    title: '设计资源',
    isOpen: false,
    items: [
      { icon: '🎨', title: 'Dribbble', item_desc: '全球设计师作品分享平台', item_url: 'https://dribbble.com' },
      { icon: '🎨', title: 'Behance', item_desc: 'Adobe旗下创意作品分享社区', item_url: 'https://www.behance.net' },
    ],
  },
]);

// 折叠按钮组件（shadcn需要自定义触发文本）
const CollapsibleButton = {
  props: ['isOpen'],
  template: "<span>{{ isOpen ? '折叠' : '展开' }}</span>",
};

const addFolder = () => {
  if (folderForm.value.title === '') {
    toast.error('收藏夹名称不能为空');
    return;
  }
  addResourceCategory({ title: folderForm.value.title }).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      folderForm.value.open = false;
      folderForm.value.title = '';
    }
  });
};

const getFolders = () => {
  let result = [];
  getResourceCategories()
    .then((res) => {
      if (res.code == 200) {
        const data = res.data;
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          result.push({
            title: item.title,
            isOpen: false,
            items: [],
          });
        }
      }
    })
    .then(() => {
      for (let i = 0; i < result.length; i++) {
        getItemsByCategory(result[i].title).then((res) => {
          if (res.code == 200) {
            result[i].items = res.data;
          }
        });
      }
    });
  folders.value = result;
};

const changeIcon = (e) => {
  const file = e.target.files[0];
  itemForm.value.iconType = file.type;
  itemForm.value.iconName = file.name;

  const reader = new FileReader();
  reader.onload = function (event) {
    itemForm.value.icon = event.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped></style>
