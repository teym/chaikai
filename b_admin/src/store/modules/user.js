import { login, loginCode, regist, logout, getInfo, fetchStat, fetchFinance } from '@/api/user'
import { fetchPv } from '@/api/goods'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  telephone: '',
  roles: [],
  statusCode: 0,
  brandCount: 0,
  amount: 0,
  activity: 0,
  xiaoer: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, telephone) => {
    state.telephone = telephone
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_STATUS: (state, code) => {
    state.statusCode = code
  },
  SET_BRAND_COUNT: (state, count) => {
    state.brandCount = count
  },
  SET_AMOUNT: (state, amount) => {
    state.amount = amount
  },
  SET_ACTIVITY: (state, activity) => {
    state.activity = activity
  },
  SET_XIAOER: (state, xiaoer) => {
    state.xiaoer = xiaoer
  }
}

const actions = {
  regist({ commit }, userInfo) {
    const { username, password, name, code } = userInfo
    return new Promise((resolve, reject) => {
      regist({ telephone: username.trim(), password: password, company: name, code: code }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setTimeout(() => {
          resolve()
        }, 200);
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },
  // user login
  loginCode({ commit }, codes) {
    return new Promise((resolve, reject) => {
      loginCode(codes).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setTimeout(() => {
          resolve()
        }, 200);
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ telephone: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        setTimeout(() => {
          resolve()
        }, 200);
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      Promise.all([getInfo(), fetchStat(), fetchPv({ page: 1, size: 5 }), fetchFinance()]).then(([r1, r2, r3, r4]) => {
        console.log(r1);
        if (r1.code === 20003) {
          throw r1
        }
        const { roles, company, avatar, telephone } = r1.data || {}
        const xiaoer = window.location.search.indexOf('sso') > 0;
        commit('SET_XIAOER', xiaoer)

        commit('SET_ROLES', roles || ['admin'])
        commit('SET_NAME', company)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', telephone)

        const { statusCode, contactWechat, contact } = r2.data || {}
        commit('SET_STATUS', statusCode)

        const { count } = (r3.data || {}).pager || {}
        commit('SET_BRAND_COUNT', count || 0)

        const { totalAmount, activityAmount } = r4.data || {}

        commit('SET_AMOUNT', totalAmount || 0)
        commit('SET_ACTIVITY', activityAmount || 0)

        window._MEIQIA('metadata', {
          tel: telephone,
          name: company,
          weixin: contactWechat,
          contact: contact
        })

        resolve(Object.assign({}, r1.data, { statusCode, brandCount: count, roles: roles || ['admin'] }))
      }).catch(error => {
        console.log(error);
        const xiaoer = window.location.search.indexOf('sso') > 0;
        if (error.code === 20003 && xiaoer) {
          commit('SET_XIAOER', xiaoer)
          commit('SET_ROLES', ['admin'])
          commit('SET_NAME', 'no')
          commit('SET_AVATAR', 'no')
          commit('SET_INTRODUCTION', 'no')
          commit('SET_STATUS', 0)
          commit('SET_BRAND_COUNT', 0)
          commit('SET_AMOUNT', 0)
          commit('SET_ACTIVITY', 0)

          resolve(Object.assign({ roles: ['admin'], company: 'no', avatar: 'no', telephone: 'no', statusCode: 0, brandCount: 0 }))
        } else {
          reject(error)
        }
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      setTimeout(() => {
        resolve()
      }, 200);
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
