import { asyncRoutes, constantRoutes } from '@/router'
import { getRoutes } from '@/api/role'
import _ from 'underscore'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // return new Promise(resolve => {
    //   let accessedRoutes
    //   if (roles.includes('admin')) {
    //     accessedRoutes = asyncRoutes || []
    //   } else {
    //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   }
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
    // {
    //   path: '/error',
    //   component: Layout,
    //   redirect: 'noRedirect',
    //   name: 'ErrorPages',
    //   hidden: true,
    //   children: [
    //     {
    //       path: '401',
    //       component: () => import('@/views/error-page/401'),
    //       name: 'Page401',
    //       meta: { title: '401', noCache: true }
    //     },
    //     {
    //       path: '404',
    //       component: () => import('@/views/error-page/404'),
    //       name: 'Page404',
    //       meta: { title: '404', noCache: true }
    //     }
    //   ]
    // }
    return getRoutes().then(r => {
      // asyncRoutes.filter(i=>)
      const as = r.data.filter(i => i.displayName).map(i => ([i.displayName, { obj: i, ch: _.object((i.list || []).map(j => [j.displayName, j])) }]))
      const accessedRoutes = asyncRoutes.filter((i) => (i.path !== '*' && !as[i.path])).map(i => Object.assign(i, { children: (i.children || []).filter(j => !((as[i.path] || {}).ch || {})[j.path]) }))
      // console.log(as, accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      return accessedRoutes
    })
    // .catch(e => {
    //   console.log(e);
    //   commit('SET_ROUTES', asyncRoutes)
    //   return asyncRoutes
    // })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
