<template>
<div class="container">
    <div class="row"><div class="col-12 mb-3">
							<div class="heading_view">
								<h2>Dashbord Menu</h2>
							</div>
						</div></div>
<div class="row">
    <div class="col-12 d-flex flex-wrap plr">
        <div class="fl-col" v-for="i in dashbordmenu"  @click="MenuClick(i)">
							<div class="course_box">
								<a>
									<div class="icon_relative">
										<i v-bind:class="i.IconImage"></i>
										<span>{{ i.MenuDisplayText}}</span>
									</div>

								</a>
							</div>
						</div>
    </div>
                </div>

</div>
</template>

<script>

import hp from '../helper.js';

export default {
  name: 'Login',
   data: function () { return {
    ScreenName:"Dashbord Menu",
    dashbordmenu:[],
    Fdata:{
        Username:"",
        Password:""
        }
    }},
  props: {
    msg: String
  },
   methods:{
       MenuClick: function(i)
       {
           console.log(i);
         if(i.ScreenType=="Custom")
         {
             console.log(i.ScreenName);
             i=JSON.parse(JSON.stringify(i));
             this.$router.push({ name: i.ScreenName, params:i }  );
         }
         else
         {
             console.log(i.ScreenType);
            
            this.$router.push({ name: i.ScreenType, params:i }  );
         }
       },
       onwindowload : function()
       {
        var db = cordova.plugins.filemodesqlite
        var SQL = hp.SqlReplace("select * from Menuconfig where AccessLevel=1 and Language='English' and Foldername='Dashboard' order by DisplayNo",[]);
        db.executeSql(SQL,hp.DBobj,this.querySuccess,this.queryError);
       },
       queryError : function(e)
       {
            console.log("Error " + e);
       },
       querySuccess : function(Resultset)
       {
        console.log(Resultset);
        
        this.dashbordmenu=Resultset;
        
       }
       
   },
   created: function () {
    // `this` points to the vm instance
     this.onwindowload();
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.fl-col {
    -ms-flex: 0 0 50%;
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 7px;
    margin-bottom: 14px;
}
.course_box {
    background: #fff;
    text-align: center;
}
.course_box a {
    display: block;
}
.icon_relative {
    line-height: 90px;
    font-size: 30px;
    color: #fff;
    background: #f0f0f0;
    text-align: center;
    border-radius: 3px;
    padding: 10px;
}
.icon_relative i {
    display: block;
    font-size: 35px;
    color: #3f51b4;
    margin-bottom: 8px;
}
.course_box span {
    color: #333;
    text-align: center;
    display: block;
    font-size: 14px;
    line-height: 1.5;
    text-transform: capitalize;
}
</style>
