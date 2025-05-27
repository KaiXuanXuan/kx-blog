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
  }
];

 export default routes