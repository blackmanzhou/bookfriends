import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import Validator from 'vue-validator'

// 首页导航条
import Home from '@/view/home'
// 注册
import Register from '@/view/register'
// 登录
import Login from '@/view/login'
// 首页内容
import Hello from '@/view/home_content/hello'
// 个人信息
import Personal from '@/view/information/personal'

// 项目模块
import project from '@/view/project/project'
import smallproject from '@/view/project/smallproject'
import Package from '@/view/project/package'
import registration from '@/view/project/registration'

import members from '@/view/members/member'
import account from '@/view/members/account'
import integral from '@/view/members/integral'
import mem_package from '@/view/members/mem_package'
import style from '@/view/members/style'

import Inquiry from '@/view/inquiry/inquiry'
import InquiryNone from '@/view/inquiry/inquiryNone'

import Arrange from '@/view/arrange/arrange';
import AddWork from '@/view/arrange/new_add_work';

import Reservation from '@/view/reservation/reservation'
import Mrliu from '@/view/reservation/Mrliu'
import Vdetails from '@/view/reservation/Vdetails'
import Visdoctor from '@/view/reservation/Visdoctor'
import BookKinds from '@/view/reservation/bookKinds'
import UserDetail from '@/view/reservation/userDetail'
import UserBooks from '@/view/reservation/userBook'
import Appointreport from '@/view/reservation/appointreport'
import LiuContent from '@/view/reservation/liuContent'

Vue.use(Router)
Vue.use(Resource)
Vue.use(Validator)

export default new Router({
  routes: [
    {path:'/',component: Login},
    { path: '/register',component: Register},
    { path: '/home',component: Home,name:'',
        children:[
            {path:'personal',component: Personal ,name:'个人信息'},
            {path:'hello',component: Hello ,name:'子首页'},
            {path:'Inquiry',component: Inquiry,name:'问诊' },
            {path:'Noinquiry',component: InquiryNone,name:'无问诊' },
            {path: 'arrange',component: Arrange,name:'排班',
                children:[
                   {path:'new_add_work',component: AddWork}
                ]
            },
            {path:'members',component: members,name:'会员',
                children:[
                  {path:'mem_package',component: mem_package,name:'会员套餐'},
                  {path:'account',component: account,name:'会员帐号'},
                  {path:'integral',component: integral,name:'会员积分'},
                  {path:'style',component: style,name:'会员类型'},
                  {path: '/', redirect: 'account' }//在子路由定向到account
                ]
            },
            {path:'infomanager',component: project,name:'信息管理',
                children:[
                  {path:'users',component: smallproject,name:'用户'},
                  {path:'books',component: Package,name:'图书'},
                  {path:'admins',component: registration,name:'管理员'},
                  {path: '/', redirect: 'users' }//在子路由定向到smallproject
                ]
            },
            {path:'infochart',component: Reservation,name:'信息汇总',
                children:[
                  {path:'book',component: Mrliu,name:'图书分析',
                    children:[
                      {path:'kinds',component: BookKinds,name:'图书类别'},
                      {path:'visits',component: LiuContent,name:'图书访问量'},
                      {path: '/', redirect: 'kinds' }
                    ]

                  },
                  {path:'Vdetails',component: Vdetails,name:'详情页'},
                  {path: '/', redirect: 'book' },
                  {path: 'user', component: Appointreport,name:'用户分析',
                    children:[
                      {path:'kinds',component: Visdoctor,name:'用户类别'},
                      {path:'details',component: UserDetail,name:'用户详情'},
                      {path:'userbook',component: UserBooks,name:'用户书架'},
                      {path: '/', redirect: 'kinds' }
                    ]
                  }
                ]
            },
            
        ]
}     
  ]
})
