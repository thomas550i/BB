<template>
<div> <select  class="form-control" v-model="value" @input="$emit('input', $event.target.value)">
    <option v-for="option in optiovalue" v-bind:value="option.value">
        {{ option.text }}
    </option>
    </select></div>
</template>

<script>

import hp from '../helper.js';
export default {
  name: 'SelectCom',
  data: function () { return {
   optiovalue:[]
    }},
     props:{query:String,value:String},
  methods:{
      loadOptionValue:function()
      {
        var t = this;
        //console.log(this.query);
        var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select QueryText from QueryConfig where ScreenName='"+this.query+"'",[]);
        db.executeSql(SQL,hp.DBobj,
            function(s){
                //console.log(s);
                var Qsql = s[0].QueryText;
                //console.log(Qsql);
                 db.executeSql(Qsql,hp.DBobj,t.querySuccess,t.queryError);
            },
            function(e){console.log(e);});
      },
      querySuccess:function(s)
      {
          this.optiovalue = s;
      },
      queryError:function(e)
      {
          console.log(e);
      }
    },
      created: function () {
          this.loadOptionValue();
  }
}


</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 
  color: #2c3e50;
  margin-top: 60px;
}
</style>
