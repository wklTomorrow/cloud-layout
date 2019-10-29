import Vue from 'vue'
import Router from 'vue-router'
import NavIframe from '@/components/NavIframe'
import md from '@/components/md'
import pdf from '@/components/pdf'
import Grid from '@/components/Grid'
import login from '@/components/login'
import home from '@/components/home'
import yzm from '@/components/yzm'
import use from '@/components/use'
import user from '@/components/user'
import limited from '@/components/limited'
import flex from '@/components/flex'
import load from '@/components/load'
import Rolelimited from '@/components/Rolelimited'
import SpringCloud from '@/components/SpringCloud'
import Microservice from '@/components/Microservice'
import table from '@/components/table'
import space from '@/components/space'


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/home",
      name: "home",
      component: home,
      meta: {
        requireAuth: true,
      },
      children: [
        {
          path: '', 
          name: 'NavIframe',
          component: NavIframe
        },
        {
          path: "NavIframe",
          name: "NavIframe",
          component: NavIframe
        },
        {
          path: "readMe.md",
          name: "md",
          component: md
        },
        {
          path: "SpringCloud.md",
          name: "SpringCloud",
          component: SpringCloud
        },
        {
          path: "Microservice.pdf",
          name: "Microservice",
          component: Microservice
        },
        {
          path: "测试.pdf",
          name: "pdf",
          component: pdf
        },
        {
          path: "Grid",
          name: "Grid",
          component: Grid
        },
        {
          path: "use",
          name: "use",
          component: use
        },
        {
          path: "user",
          name: "user",
          component: user
        },
        {
          path: "limited",
          name: "limited",
          component: limited
        },
        {
          path: "Rolelimited",
          name: "Rolelimited",
          component: Rolelimited
        }
      ]
    },
    {
      path: "/",
      name: "login",
      component: login
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/yzm",
      name: "yzm",
      component: yzm
    },
    {
      path: "/flex",
      name: "flex",
      component: flex
    },
    {
      path: "/load",
      name: "load",
      component: load
    },
    {
      path: "/table",
      name: "table",
      component: table
    },
    {
      path: "/space",
      name: "space",
      component: space
    }
   
  ]
})


