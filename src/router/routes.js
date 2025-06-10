const routes = [
  {
    path: '/',
    name: 'Splash',
    component: () => import('@/views/Splash.vue'),
    meta: { title: '进入', hideNav: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页', hideNav: false },
  },
  {
    path: '/friendsLink',
    name: 'FriendsLink',
    component: () => import('@/views/FriendsLink.vue'),
    meta: { title: '友链', hideNav: false },
  },
  {
    path: '/relax',
    name: 'Relax',
    component: () => import('@/views/Relax.vue'),
    meta: { title: '摸鱼', hideNav: false },
  },
  {
    path: '/editor',
    name: 'Editor',
    component: () => import('@/views/Editor.vue'),
    meta: { title: '写文', hideNav: false },
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('@/views/Report.vue'),
    meta: { title: 'Agent', hideNav: false },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { title: '404', hideNav: true },
  },
];

export default routes;
