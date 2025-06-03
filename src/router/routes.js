const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/friendsLink',
    name: 'FriendsLink',
    component: () => import('@/views/FriendsLink.vue'),
    meta: { title: '友链' }
  },
  {
    path: '/relax',
    name: 'Relax',
    component: () => import('@/views/Relax.vue'),
    meta: { title: '摸鱼' }
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/Editor.vue'),
    meta: { title: '写文' }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/Report.vue'),
    meta: { title: '待办' }
  }
];

 export default routes