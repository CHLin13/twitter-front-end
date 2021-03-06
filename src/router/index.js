import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import MainPage from '../views/MainPage.vue'
import { Toast } from '../utils/helpers'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/reply_list/:id',
    name: 'Tweet',
    component: () => import('../views/Tweet.vue')
  },

  {
    path: '/users/:id/followings',
    name: 'FollowingPage',
    component: () => import('../views/FollowingPage.vue'),
  },
  {
    path: '/users/:id/followers',
    name: 'FollowerPage',
    component: () => import('../views/FollowingPage.vue'),
  },
  {
    path: '/users/:id',
    name: 'UserPage',
    component: () => import('../views/UserPage.vue')
  },
  {
    path: '/setting',
    name: 'SettingPage',
    component: () => import('../views/SettingPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/admin/users',
    name: 'AdminUserPage',
    component: () => import('../views/admin/AdminUserPage.vue')
  },
  {
    path: '/admin/tweets',
    name: 'AdminTweetPage',
    component: () => import('../views/admin/AdminTweetPage.vue')
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = new VueRouter({
  linkExactActiveClass: 'active',
  routes
})

router.beforeEach((to, from, next) => {
  const tokenInLocalStorage = localStorage.getItem('simpleTwitter-token')
  const tokenInStore = store.state.token
  let isAuthenticated = store.state.isAuthenticated

  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    if (to.name === "AdminUserPage" || to.name === "AdminTweetPage") {
      isAuthenticated = store.dispatch('fetchCurrentAdmin')
    } else {
      isAuthenticated = store.dispatch('fetchCurrentUser')
    }
  }


  // ????????????????????? token ?????????
  const pathsWithoutAuthentication = ['Login', 'Register', 'AdminLogin']

  // ?????? token ?????????????????????????????????????????????????????????
  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    Toast.fire({
      icon: 'warning',
      title: '??????????????????'
    })
    next('/login')
    return
  }


  // ?????? token ???????????????????????????????????????????????????????????????
  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next('/')
    return
  }
  next()
})

export default router
