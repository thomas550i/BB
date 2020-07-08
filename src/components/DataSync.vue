<template>
  <div>
    <div class="row"><div class="col-12 mb-3">
							<div class="heading_view">
								<h2>{{$route.params.MenuDisplayText}}</h2>
							</div>
						</div></div>
<div class="container">
                  
<div>Uploading Tables...</div>
                
</div>
  </div>
</template>

<script>

import hp from '../helper.js';
import splash from '../splash.vue'

export default {
  name: 'app',
  data: function () { return {
    Apilist:[],
    DatatoUpload:[],
    MSGlist:[]
    }},
  methods:{
      loadApiconfig : function()
      {
        var t = this;
      
        var SQL = hp.SqlReplace("select * from apiconfig",[]);
         hp.db.executeSql(SQL,hp.DBobj,
        function(s){
          t.Apilist=s;
          console.log("Apilist-->"+JSON.stringify(s))
          t.uploaddata();
        },
        function(e){
          console.log("Load Apilist Error " + e);
        });
      },
      uploaddata : function()
      {
          var t = this;
          if(this.Apilist.length==0)
          {
              navigator.notification.alert("Nothing to Upload", function(){},"Sync failed","OK")
              return false;
          }
          
          let count=this.Apilist.length;
          let i=0;
           for(let a of this.Apilist){
               let jobj = {"MTablename":a.MTablename,"STablename":a.STablename,"TableData":[]}
                i++;
                var SQL = hp.SqlReplace(a.Query,[]);
                hp.db.executeSql(SQL,hp.DBobj,
                function(s){
                    jobj.TableData=s;
                    t.DatatoUpload.push(jobj);
                console.log(a.MTablename+"-->"+JSON.stringify(jobj))
                if(i==count)
                    t.callapi();
                },
                function(e){
                console.log("Load "+a.MTablename+" Error " + e);
                });
            }

            
      },
      callapi : function()
      {
          let t =this;
          console.log("comingcallapi--->"+JSON.stringify(this.DatatoUpload));
          let count=this.DatatoUpload.length;
          let i=0;
          for(let d of this.DatatoUpload){
                i++;
                let api = hp.uploaddata(d);
                api.then(function (response) {
                    //this.handleReturnData(response);
                   if(i==count)
                   {
                       t.downloadDB();
                   }
                });
          }
      },
      downloadDB : function(){
      let RootFolder = hp.RootFolder;
      var t = this;
      t.StatusMsg = "Downloading Databace..."
      var dbpath = hp.getClientDBurl();
      dbpath.then(function (response) {
        console.log("response--->");
        console.log(response);
              var fileTransfer = new FileTransfer();
              console.log(response.Data.DBURL);
              var uri = encodeURI(response.Data.DBURL);
              var DBpath = cordova.file.externalRootDirectory+"/"+RootFolder+"/config.sqlite";
              //var fileURL =  "///storage/emulated/0/DCIM/myFile";

              fileTransfer.download(
              uri, DBpath, function(entry) {
                console.log("DB download complete: " + entry.toURL());
                $('.progress-bar').css('width', '100%').attr('aria-valuenow', 100); 
                t.$router.push('login');
              },
            
              function(error) {
                t.StatusMsg="DB download error code " + error.code;
                console.log("download error source " + error.source);
                console.log("download error target " + error.target);
                console.log("download error code" + error.code);
              },
            
              false, {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
              }
              );
      });
    },
      handleReturnData : function(res)
      {
          console.log("res---->");
          console.log(res);
      }
    },
    created: function () {
   
    this.loadApiconfig();
  },
  components: {
 
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
