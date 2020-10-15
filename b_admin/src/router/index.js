import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/regist',
    component: () => import('@/views/login/create'),
    hidden: true
  },
  {
    path: '/resetpass',
    component: () => import('@/views/login/reset'),
    hidden: true
  },
  {
    path: '/sso',
    component: () => import('@/views/login/sso'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '后台首页', icon: 'home', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/index',
    name: 'Goods',
    children: [
      {
        path: 'index',
        component: () => import('@/views/goods/table'),
        name: 'goods-table',
        meta: { title: '商品管理', icon: 'goods' }
      },
      {
        path: 'create',
        component: () => import('@/views/goods/create'),
        name: 'goods-create',
        hidden: true,
        meta: { title: 'Create' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/index',
    name: 'Activity',
    meta: { title: '活动管理', icon: 'activity' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/table'),
        name: 'activity-table',
        meta: { title: '活动管理', icon: 'table' }
      },
      {
        path: 'create',
        component: () => import('@/views/activity/create'),
        name: 'activity-create',
        hidden: true,
        meta: { title: '发布活动', icon: 'table' }
      },
      {
        path: 'order',
        component: () => import('@/views/activity/orders'),
        name: 'activity-order',
        hidden: true,
        meta: { title: '活动订单', icon: 'table' }
      },
      {
        path: 'qorder',
        component: () => import('@/views/activity/qorders'),
        name: 'activity-qorder',
        hidden: true,
        meta: { title: '候选订单', icon: 'table' }
      }
    ]
  },
  {
    path: '/issue',
    component: Layout,
    redirect: '/issue/index',
    name: 'Issue',
    children: [
      {
        path: 'index',
        component: () => import('@/views/issue/table'),
        name: 'issue-table',
        meta: { title: '问题管理', icon: 'issue' }
      }
      // {
      //   path: 'create',
      //   component: () => import('@/views/activity/create'),
      //   name: 'activity-create',
      //   hidden: true,
      //   meta: { title: 'Create' }
      // },
      // {
      //   path: 'order',
      //   component: () => import('@/views/activity/orders'),
      //   name: 'activity-order',
      //   hidden: true,
      //   meta: { title: 'Order' }
      // }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '账号信息', icon: 'profile' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'profile-table',
        meta: { title: '账号信息', icon: 'table' }
      },
      {
        path: 'create',
        component: () => import('@/views/profile/create'),
        name: 'profile-create',
        meta: { title: '企业认证', icon: 'table' }
      },
      {
        path: 'auth',
        component: () => import('@/views/profile/auth'),
        name: 'profile-auth',
        meta: { title: '品牌授权', icon: 'table' }
      },
      {
        path: 'buy',
        component: () => import('@/views/profile/buy'),
        name: 'profile-buy',
        meta: { title: '服务订购', icon: 'table' }
      },
      {
        path: 'topup',
        component: () => import('@/views/profile/topup'),
        name: 'profile-topup',
        meta: { title: '账户充值', icon: 'table' }
      },
      {
        path: 'balance',
        component: () => import('@/views/profile/balance'),
        name: 'profile-balance',
        meta: { title: '账户余额', icon: 'table' }
      },
      {
        path: 'withdraw',
        component: () => import('@/views/profile/withdraw'),
        name: 'profile-withdraw',
        meta: { title: '账户提现', icon: 'table' }
      },
      {
        path: 'invoice',
        component: () => import('@/views/profile/invoice'),
        name: 'profile-invoice',
        meta: { title: '开发票', icon: 'table' }
      },
      {
        path: 'invoices',
        component: () => import('@/views/profile/invoices'),
        name: 'profile-invoices',
        meta: { title: '开票记录', icon: 'table' }
      },
      {
        path: 'history',
        component: () => import('@/views/profile/history'),
        name: 'profile-history',
        meta: { title: '订购记录', icon: 'table' }
      }
    ]
  },
  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'Table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     {
  //       path: 'dynamic-table',
  //       component: () => import('@/views/table/dynamic-table/index'),
  //       name: 'DynamicTable',
  //       meta: { title: 'Dynamic Table' }
  //     },
  //     {
  //       path: 'drag-table',
  //       component: () => import('@/views/table/drag-table'),
  //       name: 'DragTable',
  //       meta: { title: 'Drag Table' }
  //     },
  //     {
  //       path: 'inline-edit-table',
  //       component: () => import('@/views/table/inline-edit-table'),
  //       name: 'InlineEditTable',
  //       meta: { title: 'Inline Edit' }
  //     },
  //     {
  //       path: 'complex-table',
  //       component: () => import('@/views/table/complex-table'),
  //       name: 'ComplexTable',
  //       meta: { title: 'Complex Table' }
  //     }
  //   ]
  // },
  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
