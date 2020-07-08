<template>
  <div>
    <div class="row"><div class="col-12 mb-3">
							<div class="heading_view">
								<h2>{{$route.params.MenuDisplayText}}</h2>
							</div>
						</div></div>
<div class="container">
                  <div class="form-body">
                          <div class="form-group"  v-for="i in FormItems" >
                          <div class="row">
                            <label class="col-lg-1">{{i.LableText}}</label>
                          <div class="col-lg-12">
                          <div class="row">
                          <div class="col-md-1">

                          <!-- TEXT -->   
                            <input v-if="i.FieldControl=='TEXT'" type="text" v-model="i.DefaultValue" :name='i.ValidationName' v-validate="i.ValidationRule"  class="form-control">
                           <!-- NUMBER -->   
                            <input v-if="i.FieldControl=='NUMBER'" type="number" v-model="i.DefaultValue" :name='i.ValidationName' v-validate="i.ValidationRule"  class="form-control">
                         
                          <!-- DATE --> 
                            <input v-if="i.FieldControl=='DATE'" type="date" v-model="i.DefaultValue" :name='i.ValidationName' v-validate="i.ValidationRule"  class="form-control"> 
                          <!-- TEXTAREA -->
                            <textarea v-if="i.FieldControl=='TEXTAREA'"  v-model="i.DefaultValue" :name='i.ValidationName' v-validate="i.ValidationRule"  class="form-control"></textarea>
                          <!-- OPTIONS -->
                          <SelectCom v-model="i.DefaultValue" v-bind:query="i.FieldQuery" v-if="i.FieldControl=='OPTIONS'" :name="i.ValidationName" v-validate="i.ValidationRule" ></SelectCom>
                            
                            

                            <div v-if="errors.has(i.ValidationName)" class="invalid-inputVee">{{ errors.first(i.ValidationName) }}</div>
                          </div>

                          </div>
                          </div>
                          </div>
                          </div>
                  </div>

                  <div><button class="btn btn-success" @click="SubmitBtnClick">Save</button></div>
</div>
  </div>
</template>

<script>

import hp from '../helper.js';
import SelectCom from './SelectCom.vue';
export default {
  name: 'app',
  data: function () { return {
    FormItems:[],
    ActionList:[],
    MSGlist:[]
    }},
  methods:{
      SubmitBtnClick:function()
      {
        this.$validator.validate().then(valid => {
                if (valid) {
                  console.log(this.FormItems);
                  this.DoAllAction();
                }
            });
      },
      getFormConfig:function()
      {
        var prams = this.$route.params;
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select * from FormConfig where Language='English' and ScreenName='"+prams.ScreenName+"' order by DisplayNo",[]);
        hp.db.executeSql(SQL,hp.DBobj,this.querySuccess,this.queryError);
      },
      queryError : function(e)
      {
          console.log("Error " + e);
      },
      querySuccess : function(Resultset)
      {
        console.log(Resultset);
        this.FormItems=Resultset;
      },
      DoAllAction : function()
      {
        if(this.ActionList.length!=0)
        {
          for (let a of this.ActionList)
          {
            if(a.ActionType=="EXECUTE")
            {
              this.EXECUTE(a.ActionPlan);
            }
            else if(a.ActionType=="NAVIGATE")
            {
              this.NAVIGATE(a.ActionValue);
            }
            else if(a.ActionType=="ALERT")
            {
              this.ALERT(a.ActionValue,a.ActionPlan,a.ActionFailedValue);
            }
          }
        }
        else
        {
          console.log("There is not Action to Do.");
        }
      },
      ALERT: function(v,p,fv)
      {
        console.log("inside");
        for(let m of this.MSGlist){
          console.log(m);
           console.log(p);
          if(m.MessageCode==p)
          {
            navigator.notification.alert(m.MessageText, function(){},m.Title,v)      
          }
        }
      },
      NAVIGATE : function(pagename)
      {
         this.$router.push(pagename);
      },
      EXECUTE : function(qryName)
      {
        var t = this;
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select QueryText from QueryConfig where ScreenName='"+qryName+"'",[]);
         hp.db.executeSql(SQL,hp.DBobj,
            function(s){
                console.log(s);
                var Qsql = s[0].QueryText;
                var SQL = hp.SqlReplace(Qsql,hp.getForReplace(t.FormItems));
                console.log(SQL);
                  hp.db.executeSql(SQL,hp.DBobj,
                 function(s){
                   console.log(s);
                 },
                 function(e){
                   console.log("Save Query False");
                 });
            },
            function(e){console.log(e);});
      },
      loadActions : function()
      {
        var t = this;
        var prams = this.$route.params;
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select * from ActionConfig where ScreenName='"+prams.ScreenName+"' order by DisplayNo",[]);
         hp.db.executeSql(SQL,hp.DBobj,
        function(s){
          t.ActionList=s;
          console.log("ActionList-->"+JSON.stringify(s))
        },
        function(e){
          console.log("Load Action list Error " + e);
        });
      },
      loadMsgData : function()
      {
        var t = this;
        var prams = this.$route.params;
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select * from MessageConfig where ScreenName='"+prams.ScreenName+"' and Language='English'",[]);
         hp.db.executeSql(SQL,hp.DBobj,
        function(s){
          t.MSGlist=s;
          console.log("MsgList-->"+JSON.stringify(s))
        },
        function(e){
          console.log("Load Message list Error " + e);
        });
      }
    },
    created: function () {
    this.getFormConfig();
    this.loadActions();
    this.loadMsgData();
  },
  components: {
    SelectCom
  }
}
//document.addEventListener('deviceready', app.init);


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
