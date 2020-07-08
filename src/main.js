//import Vue from 'vue'
import Vue from 'vue/dist/vue.js';
import login from './components/Login.vue'
import SetURL from './components/SetURL.vue'
import splash from './splash.vue'

import VueRouter from 'vue-router'
Vue.use(VueRouter)
import JQuery from 'jquery'
window.$ = JQuery


import VeeValidate from "vee-validate";
Vue.use(VeeValidate);

import Dashboard from './components/Dashboard.vue'
import headerbox from './App.vue'

import Form from './components/Form.vue'
import List from './components/List.vue'
import Folder from './components/Folder.vue'
import Form_List from './components/Form_List.vue'

///**************** CUSTOME SCREENS */
import DataSync from './components/DataSync.vue'
import Sales from './components/Sales.vue'
///**************** END CUSTOME SCREENS */


///*************** KINDO GRID */

import '@progress/kendo-theme-default/dist/all.css'

import { Grid } from '@progress/kendo-vue-grid'
import '@progress/kendo-ui';
import { AutoComplete, ComboBox, DropDownList, MultiSelect, DropdownsInstaller } from '@progress/kendo-dropdowns-vue-wrapper';

Vue.component('Grid', Grid);
Vue.use(DropdownsInstaller);
Vue.use(AutoComplete);
Vue.use(ComboBox);
Vue.use(DropDownList);
Vue.use(MultiSelect);
///*************** KINDO GRID */
Vue.directive('numericOnly', {
  bind(el) {
    el.addEventListener('keyup', () => {
      let regex = /^[0-9]*$/
      console.log("WORKING--->");
      if (!regex.test(el.value)) {
        el.value = el.value.slice(0, -1)
      }
    })
  }
})


const routes = [
  { path: '', redirect: '/splash' },
  { path: '/login',name:"login", component: login },
  { path: '/splash',name:"splash", component: splash },
  { path: '/SetURL',name:"SetURL", component: SetURL },
  { path: '/Form',name:"Form", component: Form },
  { path: '/List',name:"List", component: List },
  { path: '/Folder',name:"Folder", component: Folder },
  { path: '/Form_List',name:"Form_List", component: Form_List },
  { path: '/Dashboard',name:"Dashboard", component: Dashboard },
  { path: '/DataSync',name:"DataSync", component: DataSync },
  { path: '/Sales',name:"Sales", component: Sales }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

Vue.config.productionTip = false



document.addEventListener('deviceready', () => {
 
  new Vue({
    router,
    components: {
      headerbox
    }
  }).$mount('#app')
  
  
});


