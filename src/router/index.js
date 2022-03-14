import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * 注意：子菜单仅在路由子项时显示。长度>=1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果值为true, 表示该路由不会在侧边栏出现(默认为false)
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项目有多个子路线时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置为noRedirect，则面包屑中不会重定向
 * name:'router-name'             该名称由<keep alive>使用（必须设置！！！）
 * meta : {
    roles: ['admin','editor']    控制页面角色（可以设置多个角色）
    title: 'title'               侧边栏和面包屑中显示的名称（推荐集）
    icon: 'svg-name'/'el-icon-x' 侧边栏中显示的图标
    noCache: true                如果设置为true，则不会缓存页面（默认值为false）
    affix: true                  如果设置为true，则标签将粘贴在“标签”视图中
    breadcrumb: false            如果设置为false，则项目将隐藏在breadcrumb中（默认为true）
    activeMenu: '/example/list'  如果设置路径，侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的路由页面
 * 所有角色都可以访问
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
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    // hidden属性表示该路由不会在侧边栏出现
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
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // 个人资料
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人资料', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// 权限路由
export const asyncRoutes = [
  // 消息路由
  {
    path: '/message',
    component: Layout,
    children: [
      {
        path: 'message',
        component: () => import('@/page/message.vue'),
        name: 'Message',
        meta: {
          title: '消息',
          icon: 'message',
          roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 系别管理路由
  {
    path: '/department',
    component: Layout,
    alwaysShow: true,
    name: 'Department',
    meta: {
      title: '学院管理',
      icon: 'department',
    },
    children: [
      {
        path: 'faculty',
        component: () => import('@/page/faculty.vue'),
        name: 'Faculty',
        meta: {
          title: '院系',
          icon: 'faculty',
          roles: ['superAdministrator'],
        }
      },
      {
        path: 'major',
        component: () => import('@/page/major.vue'),
        name: 'Major',
        meta: {
          title: '专业',
          icon: 'major',
          roles: ['superAdministrator'],
        }
      },
      {
        path: 'class',
        component: () => import('@/page/cls.vue'),
        name: 'Class',
        meta: {
          title: '班级',
          icon: 'class',
          roles: ['superAdministrator', 'admin' , 'minister'],
        }
      },
      {
        path: 'teacher',
        component: () => import('@/page/teacher.vue'),
        name: 'Teacher',
        meta: {
          title: '教师',
          icon: 'teacher2',
          roles: ['superAdministrator']
        }
      },
      {
        path: 'student',
        component: () => import('@/page/student.vue'),
        name: 'Student',
        meta: {
          title: '学生',
          icon: 'student2',
          roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 岗位管理路由
  {
    path: '/post',
    component: Layout,
    // hidden: true,
    children: [
      {
        path: 'post',
        name: 'Post',
        component: () => import('@/page/post.vue'),
        meta: { title: '岗位', icon: 'post2',roles: ['superAdministrator', 'admin' , 'minister'], }
      }
    ]
  },
  // 招聘管理路由
  {
    path: '/recruits',
    component: Layout,
    children: [
      {
        path: 'recruits',
        name: 'Recruits',
        component: () => import('@/page/recruits.vue'),
        meta: { title: '招聘', icon: 'recuits',roles: ['superAdministrator', 'admin' , 'minister'], }
      }
    ]
  },
  // 企业管理路由
  {
    path: '/enterprise',
    component: Layout,
    children: [
      {
        path: 'enterprise',
        component: () => import('@/page/enterprise.vue'),
        name: 'Enterprise',
        meta: {
          title: '企业',
          icon: 'enterprise2',
          roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 管理员巡查管理路由
  {
    path: '/patrolAdmin',
    component: Layout,
    children: [
      {
        path: 'patrolAdmin',
        component: () => import('@/page/patrolAdmin.vue'),
        name: 'patrolAdmin',
        meta: {
          title: '巡查记录',
          icon: 'patrol',
          roles: ['superAdministrator'],
        }
      }
    ]
  },

  // 统计
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '统计', icon: 'home', affix: true, roles: ['superAdministrator'] }
      }
    ]
  },
  // hidden router
  // 学生周打卡管理路由
  // {
  //   path: '/clock',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'clock/:id',
  //       component: () => import('@/page/clock.vue'),
  //       name: 'Clock',
  //       meta: {
  //         title: '学生周打卡记录',
  //         // icon: 'clock',
  //         roles: ['superAdministrator', 'admin' , 'minister'],
  //       }
  //     }
  //   ]
  // },
  // 学生就职记录
  {
    path: '/offices',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'offices/:id',
        component: () => import('@/page/offices.vue'),
        name: 'Offices',
        meta: {
          title: '学生就职记录',
          // icon: 'offices',
          // roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 点击教师跳转到该教师所管理的学生
  {
    path: '/managerStudentByTeacher',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'managerStudentByTeacher/:id',
        component: () => import('@/page/managerStudentByTeacher.vue'),
        name: 'ManagerStudentByTeacher',
        meta: {
          title: '当前教师所支配的学生',
        }
      }
    ]
  },
  // 点击教师查看该教师操作历史记录
  {
    path: '/operateHistoryByTeacher',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'operateHistoryByTeacher/:id',
        component: () => import('@/page/operateHistoryByTeacher.vue'),
        name: 'OperateHistoryByTeacher',
        meta: {
          title: '操作历史记录',
          // icon: 'offices',
          // roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 点击教师下的班级查看该教师管理的班级
  {
    path: '/managerClassByTeacher',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'managerClassByTeacher/:id',
        component: () => import('@/page/managerClassByTeacher.vue'),
        name: 'ManagerClassByTeacher',
        meta: {
          title: '该教师所管理的班级',
          // icon: 'offices',
          // roles: ['superAdministrator', 'admin' , 'minister'],
        }
      }
    ]
  },
  // 点击班级跳转到该班级所拥有的学生
  {
    path: '/managerStudentByClass',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'managerStudentByClass/:id',
        component: () => import('@/page/managerStudentByClass.vue'),
        name: 'ManagerStudentByClass',
        meta: {
          title: '当前班级所拥有的学生',
        }
      }
    ]
  },
  // 点击巡查查看该教师下所有巡查记录路由
  {
    path: '/patrolNormal',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'patrolNormal/:id',
        component: () => import('@/page/patrolNormal.vue'),
        name: 'patrolNormal',
        meta: {
          title: '当前教师的巡查记录',
          icon: 'patrol',
          // roles: ['admin' , 'minister'],
        }
      }
    ]
  },
  // 点击班级跳转到该班级所拥有的学生
  {
    path: '/managerStudentByPost',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'managerStudentByPost/:id',
        component: () => import('@/page/managerStudentByPost.vue'),
        name: 'ManagerStudentByPost',
        meta: {
          title: '当前岗位下的所有学生',
        }
      }
    ]
  },
  // 点击企业列出该企业详细招聘信息
  {
    path: '/managerRecruitsByEnterprise',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'managerRecruitsByEnterprise/:id',
        component: () => import('@/page/managerRecruitsByEnterprise.vue'),
        name: 'ManagerRecruitsByEnterprise',
        meta: {
          title: '企业招聘详情',
        }
      }
    ]
  },

  // // 面试申请管理路由
  // {
  //   path: '/interview',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'interview',
  //       component: () => import('@/page/interview.vue'),
  //       name: 'Interview',
  //       meta: {
  //         title: '面试申请管理',
  //         icon: 'interview',
  //         roles: ['superAdministrator', 'admin' , 'minister'],
  //       }
  //     }
  //   ]
  // },
  // // 就职管理路由
  // {
  //   path: '/induction',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'induction',
  //       component: () => import('@/page/induction.vue'),
  //       name: 'Induction',
  //       meta: {
  //         title: '就职信息管理',
  //         icon: 'induction',
  //         roles: ['superAdministrator', 'admin' , 'minister'],
  //       }
  //     }
  //   ]
  // },
  // 反馈管理路由
  // {
  //   path: '/feedbacks',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'feedbacks',
  //       component: () => import('@/page/feedbacks.vue'),
  //       name: 'Feedbacks',
  //       meta: {
  //         title: '反馈管理',
  //         icon: 'feedbacks'
  //       }
  //     }
  //   ]
  // },
  // 系统信息路由
  // {
  //   path: '/system',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'system',
  //       component: () => import('@/page/system.vue'),
  //       name: 'System',
  //       meta: {
  //         title: '系统信息',
  //         icon: 'system'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // 您可以在根导航中设置角色
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // 或者您只能在子导航中设置角色
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // 如果不设置角色，则表示：此页面不需要权限
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true,}
  //     }
  //   ]
  // },

  /** 当路由图太长时，可以将其拆分为小模块 **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'el-icon-s-help'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
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
  // },

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
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
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

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404页面必须放在最后 !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

// const createRouter = () => new Router({
//   mode: 'history', // require service support
//   base: '/hr/', // 配置项目的基础地址
//   scrollBehavior: () => ({ y: 0 }), // 管理滚动行为 如果出现滚动 切换就让 让页面回到顶部
//   routes: [...constantRoutes] // 改成只有静态路由
// })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
