<template>
<div class="container">
<div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">Setting Up Server</h4>
                                <form action="#">
                                    <div class="form-body">
                                        <div class="form-group">
                                            <div class="row">
                                                <label class="col-lg-1">SERVER HOST</label>
                                                <div class="col-lg-12">
                                                    <div class="row">
                                                        <div class="col-md-1">
                                                            <input type="text" v-model="Fdata.URL" name="URL" v-validate="'required'"  class="form-control" placeholder="URL">
                                                            <div v-if="errors.has('URL')" class="invalid-inputVee">{{ errors.first('URL') }}</div>
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
  name: 'SetURL',
   data: function () { return {
       ScreenName:"SetURL",
    Fdata:{
        URL:"http://192.168.0.103/pos/public"
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
                   
                    var str = t.Fdata.URL
                    var n = str.indexOf("http://");
                    if(n!=-1)
                    {
                        navigator.notification.alert("Remove http from url...", function(){},"failed","OK")
                    }
                    else
                    {
                        str= "http://"+str;
                        var result = hp.checkURLvalid(str);
                        result.then(function (response) {
                            console.log("apiresult-->"+response);
                            if(response)
                            {
                                hp.SetHostURL(str+"/api");
                                t.$router.push('splash');
                            }
                            else
                            {
                                navigator.notification.alert("Not a Valid API url...", function(){},"failed","OK")
                            }
                        });
                        
                    }
                }
            });

        
       },
       
       


    


    
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>



