<template>
  <div class="container">
  <h4>Starting Up...</h4>
  <p>{{StatusMsg}}</p>
  <div class="progress">
    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">
      <span class="sr-only">70% Complete</span>
    </div>
  </div>
</div>
</template>

<script>




import hp from './helper.js';


export default {
  name: 'app',
  data: function () { return {
    db:null,
    status:false,
    StatusMsg:'',
    loading:0
    }},
  methods:{
    Checkpermissions: function()
    {
      this.StatusMsg ="Checking Location Permission..";
      var t = this;
       //var permissions = window.cordova.plugins.permissions;
       navigator.geolocation.getCurrentPosition(
         function(s){
           console.log(s);
           //t.loading=20;
           $('.progress-bar').css('width', '5%').attr('aria-valuenow', 5);    
           t.checkAppFolder();
         },
         function(e){
           console.log(e);
           t.StatusMsg = "Location permissions Not Provided...";
         });
    },
    createAppFolder : function(RootFolder)
    {
      var t = this;
          window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, 
            function (success) 
              {
                success.getDirectory(RootFolder, { create: true },
                function (success) {$('.progress-bar').css('width', '10%').attr('aria-valuenow', 10); t.CheckDb(RootFolder)},
                function (error){ t.StatusMsg ="System Can not create App Folder.";} );
              },
            function (error){ t.StatusMsg ="SD Card Not Found..";});
    },
    checkAppFolder :function() {
      var t = this;
      t.StatusMsg ="Checking App Folder..";
      var RootFolder = hp.RootFolder;
      var permissions = window.cordova.plugins.permissions;
      permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, function( status ){
        if ( status.hasPermission ) {
          t.createAppFolder(RootFolder);
        }
        else {
          console.warn("No :( ");
          permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, 
          function(success) {
            t.createAppFolder(RootFolder);
            },  function( error ) {
              t.StatusMsg ='Permission is not turned on';
            });
        }
      });
    },
    CheckDb : function(RootFolder)
    {
      var t = this;
      t.StatusMsg="Checking Databace..";
      var DBpath = cordova.file.externalRootDirectory+"/"+RootFolder+"/config.sqlite"
      window.resolveLocalFileSystemURL(DBpath, 
      function(){
        $('.progress-bar').css('width', '100%').attr('aria-valuenow', 100);
         t.$router.push('login');
      },
      function(){
        t.downloadDB(RootFolder);
      } );
      
    },
    downloadDB : function(RootFolder){
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
        init:function() {
            this.loading=true;
            this.StatusMsg="Testing..";
            if(hp.GetHostURL()=="" || hp.GetHostURL()===undefined || hp.GetHostURL()===null)
            {
              this.$router.push('SetURL');
            }
            else{
              this.Checkpermissions();
            }
           }
    },
      created: function () {
     this.init();
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
