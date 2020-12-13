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
    path: '/sso',
    component: () => import('@/views/login/create'),
    hidden: true
  },
  {
    path: '/resetpass',
    component: () => import('@/views/login/reset'),
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
        meta: { title: '后台首页', icon: 'dashboard' }
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
    path: '/system',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/system/index'),
        name: 'System',
        meta: { title: '角色配置', icon: 'table' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    redirect: '/check/index',
    name: 'Check',
    meta: { title: '审核管理', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/checks/company'),
        name: 'company-table',
        meta: { title: '企业认证', icon: 'table' }
      },
      {
        path: 'brand',
        component: () => import('@/views/checks/brand'),
        name: 'brand-create',
        meta: { title: '品牌认证', icon: 'table' }
      },
      {
        path: 'blogger',
        component: () => import('@/views/checks/blogger'),
        name: 'blogger-create',
        meta: { title: '达人认证', icon: 'table' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/index',
    name: 'Account',
    meta: { title: '账号管理', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/accounts/company'),
        name: 'account-company',
        meta: { title: '品牌方', icon: 'table' }
      },
      {
        path: 'blogger',
        component: () => import('@/views/accounts/blogger'),
        name: 'account-blogger',
        meta: { title: '达人', icon: 'table' }
      }
    ]
  },
  {
    path: '/activity',
    component: Layout,
    redirect: '/activity/index',
    name: 'Activity',
    meta: { title: '活动管理', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/table'),
        name: 'activity-table',
        meta: { title: '活动管理', icon: 'table' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'Order',
    meta: { title: '业务管理', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/activity/order'),
        name: 'order-table',
        meta: { title: '订单管理', icon: 'table' }
      },
      {
        path: 'issue',
        component: () => import('@/views/activity/issue'),
        name: 'issue-table',
        meta: { title: '订单问题', icon: 'table' }
      },
      {
        path: 'fine',
        component: () => import('@/views/activity/fine'),
        name: 'fine-table',
        meta: { title: '测评罚款', icon: 'table' }
      },
      {
        path: 'serve',
        component: () => import('@/views/activity/serve'),
        name: 'serve-table',
        meta: { title: '服务订购', icon: 'table' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/index',
    name: 'Finance',
    meta: { title: '财务管理', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/finance/index'),
        name: 'invoice-table',
        meta: { title: '开票申请', icon: 'table' }
      },
      {
        path: 'bwithdraw',
        component: () => import('@/views/finance/bwithdraw'),
        name: 'bwithdraw-table',
        meta: { title: '品牌方提现', icon: 'table' }
      },
      {
        path: 'topup',
        component: () => import('@/views/finance/topup'),
        name: 'topup-table',
        meta: { title: '品牌方充值', icon: 'table' }
      },
      {
        path: 'cwithdraw',
        component: () => import('@/views/finance/cwithdraw'),
        name: 'cwithdraw-table',
        meta: { title: '达人提现', icon: 'table' }
      },
      {
        path: 'gift',
        component: () => import('@/views/finance/gift'),
        name: 'gift-table',
        meta: { title: '打款赠送', icon: 'table' }
      }
    ]
  },
  {
    path: '/other',
    component: Layout,
    redirect: '/other/index',
    name: 'Other',
    meta: { title: '工具配置', icon: 'table' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/other/index'),
        name: 'banner-table',
        meta: { title: '轮播图', icon: 'table' }
      },
      {
        path: 'activity',
        component: () => import('@/views/other/activity'),
        name: 'activi-table',
        meta: { title: '活动插图', icon: 'table' }
      },
      {
        path: 'publish',
        component: () => import('@/views/other/publish'),
        name: 'publish-table',
        meta: { title: '公告管理', icon: 'table' }
      },
      {
        path: 'web',
        component: () => import('@/views/other/web'),
        name: 'web-table',
        meta: { title: 'H5编辑', icon: 'table' }
      }
    ]
  },
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
