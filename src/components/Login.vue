<template>
<div class="container">
<div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Login</h4>
                                <form action="#">
                                    <div class="form-body">
                                        <div class="form-group">
                                            <div class="row">
                                                <label class="col-lg-1">Username</label>
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <input type="text" v-model="Fdata.Username" name="Username" v-validate="'required'"  class="form-control" placeholder="Username">
                                                            <div v-if="errors.has('Username')" class="invalid-inputVee">{{ errors.first('Username') }}</div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="row">
                                                <label class="col-lg-1">Password</label>
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-md-2">
                                                            <input type="Password"  v-model="Fdata.Password" name="Password"  v-validate="{ required: true, min: 3 }" class="form-control" placeholder="Password">
                                                             <div v-if="errors.has('Password')" class="invalid-inputVee">{{ errors.first('Password') }}</div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <div class="form-actions">
                                        <div class="text-right">
                                          
                                            <button type="button" class="btn btn-info" @click="loginbtnclick" >Submit</button>
                                        </div>
                                    </div>
                                    </div>  
                                </form>
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
       ScreenName:"Login",
    Fdata:{
        Username:"vino123",
        Password:"11223344"
        }
    }},
  props: {
    msg: String
  },
   methods:{
       loginbtnclick : function()
       {
           var t = this;
           this.$validator.validate().then(valid => {
                if (valid) {
                    hp.db = cordova.plugins.filemodesqlite
                    
                    var SQL = hp.SqlReplace("Select * from employees where username='{Username}' and Mobilep='{Password}'",t.Fdata);
                    hp.db.executeSql(SQL,hp.DBobj,t.querySuccess,t.queryError);
                }
            });

        
       },
       queryError : function(e)
       {
            console.log("Error " + e);
       },
       querySuccess : function(Resultset)
       {
        console.log(Resultset);
        if(Resultset.length==0)
        {
            navigator.notification.alert("Invalid username or password ...", function(){},"Login failed","OK")
        }
        else
        {
            hp.UserData=Resultset[0];
            this.$router.push('Dashboard');
        }
       }


    


    
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>



