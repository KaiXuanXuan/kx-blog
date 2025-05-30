<template>
  <div class="max-w-7xl mx-auto px-4 py-8 center">
    <!-- 搜索框 -->
    <div class="flex justify-center">
      <div class="relative max-w-lg items-center mb-8 transition-all duration-750" :class="{ 'w-full': focusSearch }">
        <Input id="search" type="text" placeholder="搜索..." class="pl-10 " @focus="focusSearch = true"
          @blur="focusSearch = false" />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
          <Search class="size-6 text-muted-foreground" />
        </span>
      </div>
    </div>

    <!-- 添加收藏夹 -->
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
          <Button class="w-full" @click="addFolder" :disabled="isLoading">确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 编辑收藏夹 -->
    <Dialog v-model:open="folderEditForm.open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑收藏夹</DialogTitle>
          <DialogDescription>请输入新的收藏夹名称</DialogDescription>
        </DialogHeader>
        <Input v-model="folderEditForm.title" placeholder="收藏夹名称" class="mb-4" />
        <DialogFooter>
          <Button class="w-full" @click="updateFolder" :disabled="isLoading">确认修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 删除收藏夹 -->
    <Dialog v-model:open="folderDeleteForm.open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除收藏夹</DialogTitle>
          <DialogDescription>确定要删除收藏夹和其中所有项目吗？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button class="" variant="outline" @click="folderDeleteForm.open = false" :disabled="isLoading">取消</Button>
          <Button class="" @click="deleteFolder" :disabled="isLoading">确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 添加网站 -->
    <Dialog v-model:open="itemForm.open">
      <DialogTrigger asChild class="mr-4">
        <Button class="mb-4">添加网站</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加网站</DialogTitle>
          <DialogDescription>请输入网站信息</DialogDescription>
        </DialogHeader>
        <Select v-model="itemForm.category_id" placeholder="选择分类" class="mb-4">
          <SelectTrigger class="w-full cursor-pointer">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem class="cursor-pointer" v-for="item in categoryList" :key="item.id" :value="item.id">
              {{ item.title }}</SelectItem>
          </SelectContent>
        </Select>

        <Input v-model="itemForm.title" placeholder="网站名称" class="" />
        <Input v-model="itemForm.item_desc" placeholder="网站描述" class="" />
        <Input v-model="itemForm.item_url" placeholder="网站地址" class="" />
        <Input placeholder="网站图标" type="file" @change="changeAddIcon" class="" />
        <img :src="itemForm.icon"/>

        <DialogFooter>
          <Button class="w-full" @click="addItem" :disabled="isLoading">确认添加</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 编辑网站 -->
    <Dialog v-model:open="itemEditForm.open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>编辑</DialogTitle>
          <DialogDescription>编辑网站信息</DialogDescription>
        </DialogHeader>
        <Select v-model="itemEditForm.category_id" placeholder="选择分类" class="mb-4">
          <SelectTrigger class="w-full cursor-pointer">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem class="cursor-pointer" v-for="item in categoryList" :key="item.id" :value="item.id">
              {{ item.title }}</SelectItem>
          </SelectContent>
        </Select>

        <Input v-model="itemEditForm.title" placeholder="网站名称" class="" />
        <Input v-model="itemEditForm.item_desc" placeholder="网站描述" class="" />
        <Input v-model="itemEditForm.item_url" placeholder="网站地址" class="" />
        <Input placeholder="网站图标" type="file" @change="changeEditIcon" class="" />
        <img :src="itemEditForm.icon" />
        <DialogFooter>
          <Button class="w-full" @click="updateItem">确认修改</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- 删除网站 -->
    <Dialog v-model:open="itemDeleteForm.open">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>删除</DialogTitle>
          <DialogDescription>确定要删除该网站吗？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">取消</Button>
          <Button @click="deleteItem">确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Badge variant="secondary" class="h-6 ">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
      </svg>
      右键点击可编辑
    </Badge>

    <!-- 收藏夹列表 -->
    <div class="space-y-4">
      <Collapsible v-for="(folder, index) in folders" :key="folder.id" v-model:open="folder.isOpen"
        class="border rounded-lg relative">
        <CollapsibleTrigger
          class="cursor-pointer relative rounded-md flex items-center justify-between w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900">
          <div class="flex items-center gap-2">
            <div class="h-5 w-5 flex items-center">{{ folder.isOpen ? '📂' : '📁' }}</div>
            <span class="text-lg font-medium">{{ folder.title }}</span>
          </div>
          <ContextMenu>
            <ContextMenuTrigger class="absolute w-full h-full left-0 top-0"> </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem @click="openFolderEditDialog(folder)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>编辑
              </ContextMenuItem>
              <ContextMenuItem @click="openFolderDeleteDialog(folder)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                  stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>删除
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </CollapsibleTrigger>

        <DropdownMenu>
          <DropdownMenuTrigger asChild
            class="text-gray-500 w-8 h-8 p-1 absolute right-6 top-4 cursor-pointer rounded-2xl hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem class="cursor-pointer" @click="folderEditForm.open = true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>编辑
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @click="folderDeleteForm.open = true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CollapsibleContent class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <LinkCard v-for="(item, itemIdx) in folder.items" :key="itemIdx" :item="item" :delay="itemIdx * 0.1"
              :categoryList="categoryList" @openItemEditDialog="openItemEditDialog"
              @openItemDeleteDialog="openItemDeleteDialog" />
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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';
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
// 收藏夹编辑表单
const folderEditForm = ref({
  open: false,
  title: '',
  id: 0,
})
// 收藏夹删除表单
const folderDeleteForm = ref({
  open: false,
  id: 0,
})
// 收藏夹中项目新增表单
const itemForm = ref({
  open: false,
  title: '',
  item_desc: '',
  item_url: '',
  category_id: 0,
  icon: '',
  iconType: '',
  iconName: '',
});
// 收藏夹中项目编辑表单
const itemEditForm = ref({
  open: false,
  title: '',
  item_desc: '',
  item_url: '',
  category_id: 0,
  icon: '',
  iconType: '',
  iconName: '',
  id: 0,
})
// 收藏夹中项目删除表单
const itemDeleteForm = ref({
  open: false,
  id: 0,
})

const folders = ref([]);
const categoryList = ref([]);

const isLoading = ref(false);
const focusSearch = ref(false);

onMounted(() => {
  getFolders();
});

const openFolderEditDialog = (folder) => {
  const { title, id } = folder;
  folderEditForm.value.title = title;
  folderEditForm.value.id = id;
  folderEditForm.value.open = true;
}

const openFolderDeleteDialog = (folder) => {
  const { id } = folder;
  folderDeleteForm.value.id = id;
  folderDeleteForm.value.open = true;
}

const openItemEditDialog = (item) => {
  itemEditForm.value = item;
  itemEditForm.value.open = true;
}

const openItemDeleteDialog = (item) => {
  const { id } = item;
  itemDeleteForm.value.id = id;
  itemDeleteForm.value.open = true;
}

const addFolder = () => {
  if (folderForm.value.title === '') {
    toast.error('收藏夹名称不能为空');
    return;
  }
  isLoading.value = true;
  addResourceCategory(folderForm.value.title).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      folderForm.value.open = false;
      folderForm.value.title = '';
    }
  }).finally(() => {
    isLoading.value = false;
  });
};

const updateFolder = () => {
  if (folderEditForm.value.title === '') {
    toast.error('收藏夹名称不能为空');
    return;
  }
  isLoading.value = true;
  const { title, id } = folderEditForm.value;
  updateResourceCategory(id, title).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      folderEditForm.value.open = false;
    }
  }).finally(() => {
    isLoading.value = false;
  });
}

const deleteFolder = () => {
  const { id } = folderDeleteForm.value;
  isLoading.value = true;
  deleteResourceCategory(id).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      folderDeleteForm.value.open = false;
    }
  }).finally(() => {
    isLoading.value = false;
  });
}

const validateItemForm = (form) => {
  if (form.title === '') {
    toast.error('网站名称不能为空');
    return false;
  }
  if (form.item_url === '') {
    toast.error('网站地址不能为空');
    return false;
  }
  if (form.category_id === 0) {
    toast.error('请选择分类');
    return false;
  }
  if (form.icon === '') {
    toast.error('请上传网站图标');
    return false;
  }
  return true;
}

const addItem = () => {
  const check = validateItemForm(itemForm.value);
  if (!check) return;

  isLoading.value = true;
  const { title, item_url, item_desc, category_id, icon, iconType, iconName } = itemForm.value;
  const file = new File([icon], iconName, { type: iconType });
  addResourceItem({ title, item_url, item_desc, category_id }, file).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      itemForm.value.open = false;
      itemForm.value.title = '';
      itemForm.value.item_desc = '';
      itemForm.value.item_url = '';
      itemForm.value.category_id = 0;
      itemForm.value.icon = '';
      itemForm.value.iconType = '';
      itemForm.value.iconName = '';
    }
  }).finally(() => {
    isLoading.value = false;
  });
}

const updateItem = () => {
  const check = validateItemForm(itemEditForm.value);
  if (!check) return;

  isLoading.value = true;
  const { title, item_url, item_desc, category_id, icon, iconType, iconName, id } = itemEditForm.value;
  const file = new File([icon], iconName, { type: iconType });
  updateResourceItem(id, { title, item_url, item_desc, category_id }, file).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
      itemEditForm.value.open = false;
    }
  }).finally(() => {
    isLoading.value = false;
  });
}

const deleteItem = () => {
  const { id } = itemDeleteForm.value;
  isLoading.value = true;
  deleteResourceItem(id).then((res) => {
    if (res.code == 200) {
      const msg = res.message;
      toast.success(msg);
      getFolders();
    }
    itemDeleteForm.value.open = false;
  }).finally(() => {
    isLoading.value = false;
  });
}

const getFolders = () => {
  getResourceCategories()
    .then((res) => {
      if (res.code !== 200) return [];
      // 初始化分类列表
      const categories = res.data.map(item => ({
        id: item.id,
        title: item.title,
        isOpen: false,
        items: []
      }));
      categoryList.value = categories;
      // 收集所有获取条目的Promise
      const itemPromises = categories.map((folder, index) => {
        return getItemsByCategory(folder.id).then(res => {
          if (res.code === 200) {
            categories[index].items = res.data;
          }
          return res;
        });
      });
      // 等待所有条目加载完成
      return Promise.all(itemPromises).then(() => categories);
    })
    .then(updatedFolders => {
      folders.value = updatedFolders; // 所有数据准备好后一次性更新
      console.log('加载完成的收藏夹数据:', updatedFolders);
    })
    .catch(error => {
      console.error('获取收藏夹数据失败:', error);
      toast.error('获取收藏夹数据失败');
    });
};

const changeAddIcon = (e) => {
  const file = e.target.files[0];
  itemForm.value.iconType = file.type;
  itemForm.value.iconName = file.name;

  const reader = new FileReader();
  reader.onload = function (event) {
    itemForm.value.icon = event.target.result;
  };
  reader.readAsDataURL(file);
};

const changeEditIcon = (e) => {
  const file = e.target.files[0];
  itemEditForm.value.iconType = file.type;
  itemEditForm.value.iconName = file.name;

  const reader = new FileReader();
  reader.onload = function (event) {
    itemEditForm.value.icon = event.target.result;
  };
  reader.readAsDataURL(file);
}
</script>

<style scoped></style>
