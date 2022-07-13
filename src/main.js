import axios from 'axios'
import Notifications from 'notiwind'
import { createApp } from 'vue'
import linkify from 'vue-linkify'
import App from './App.vue'
import router from './router'
import store from './store'

import './css/main.css'

const token = localStorage.getItem('user-token')
const navStack = JSON.parse(localStorage.getItem('navStack'))
const isGridView = JSON.parse(localStorage.getItem('isGridView'))

function pad2 (n) {
  return (n < 10 ? '0' : '') + n
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    store.dispatch('asidePropertiesToggle', false)
  }
})

const chosenDate = new Date()
const month = pad2(chosenDate.getMonth() + 1)
const day = pad2(chosenDate.getDate())
const year = chosenDate.getFullYear()
const formattedDate = day + '-' + month + '-' + year

axios.defaults.headers.common.LocalDate = formattedDate

if (token) {
  axios.defaults.headers.common.Authorization = token
}

// Add a response interceptor
axios.interceptors.response.use((resp) => resp, function (error) {
  const errorMessage = error?.response?.data.error
  if (errorMessage.includes('invalid token') || errorMessage.includes('token expired')) {
    store.dispatch('AUTH_REFRESH_TOKEN')
  }
  return Promise.reject(error)
})

store.commit('basic', { key: 'isGridView', value: isGridView })

if (navStack) {
  for (const navElem of navStack) {
    store.commit('pushIntoNavStack', navElem)
  }
}

/* Default title tag */
const defaultDocumentTitle = 'Leadertask 2.0'

/* Collapse mobile aside menu on route change */
router.beforeEach((to) => {
  store.dispatch('asideMobileToggle', false)
  store.dispatch('asideLgToggle', false)
})

router.afterEach((to) => {
  /* Set document title from route meta */
  if (to.meta && to.meta.title) {
    document.title = `${to.meta.title} — ${defaultDocumentTitle}`
  } else {
    document.title = defaultDocumentTitle
  }

  /* Full screen mode */
  store.dispatch('fullScreenToggle', !!to.meta.fullScreen)
})

/* On error send error to Alex's server  */
window.onerror = function (msg, url, lineNo, columnNo, error) {
  if (msg.indexOf('callback is not a function') !== -1) {
    return
  }
  if (msg === 'NetworkError') {
    return
  }
  if (!url) {
    url = 'https://web'
  }
  const data = {
    msg: msg,
    url: url,
    line: lineNo,
    column: columnNo
  }
  axios({
    url: process.env.VUE_APP_LEADERTASK_API + 'api/v1/errors/front',
    method: 'POST',
    data: data
  })
}

createApp(App)
  .use(store)
  .use(router)
  .use(Notifications)
  .directive('linkified', linkify)
  .mount('#app')
