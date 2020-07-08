<template>
<header class="main-header"  v-if="showHederBar">
<div class="container_header">
          <div class="row">
          <div class="col-6"><i class="fas fa-home"></i> App Dashbord</div>
          <div class="col-6 d-flex flex-row-reverse"><i class="fas fa-arrow-circle-right"  @click="btnclicked('Next')" ></i></div>
        </div>
        </div>
          </header>
</template>

<script>

//import derectives from '../directives.js';
export default {
  name: 'app',
  data: function () { return {
    showHederBar:false
    }},
  methods:{
      checkHederBar:function()
      {
        console.log(this.$router.currentRoute.path);
        var URL = this.$router.currentRoute.path;
        if(URL === '/login' || URL === '/splash')
        {
          this.showHederBar=false;
        }
        else{
          this.showHederBar=true;
        }
      }
    },
    watch:{
      $route (to, from){
         this.checkHederBar(to, from);
      }
    }, 
      created: function () {
    
  },
  components: {
    
  }
}
//document.addEventListener('deviceready', app.init);


</script>

<style>
@import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
  color: #2c3e50;
  margin-top: 60px;
}
</style>
