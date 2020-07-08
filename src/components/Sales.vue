<template>
<div>
  <kendo-autocomplete   style="width:99%;"
    v-model="autocompleteValue"
    :data-source="dataSourceArray"
    :data-text-field="'name'"
    :placeholder="'Select Item...'"
    :dataValueField="'item_id'"
    :select="AutoChanged">
    </kendo-autocomplete>
<!--{{autocompleteValue}}



   <Grid  :style="{height: '280px'}"
          :data-items="ListData"
          :columns="columns"
          @rowclick="rowitemclicked"
          @itemchange="listvaluechanged"
          >
    </Grid> -->

<div style="width:100%;overflow:auto">
     <table class="table table-striped table-sm">
      <thead>
          <tr>
              <th v-bind:style="{ 'min-width':column.width+'px'}" v-for="(column, index) in columns" :key="index"> {{column.title}}</th>
          </tr>
      </thead>
      <tbody>
          <tr v-for="(item, index) in ListData" :key="index">
              <td v-for="(column, indexColumn) in columns" :key="indexColumn">
                
               <span v-if="column.ContentType=='LABEL'">{{item[column.field]}}</span>
               
               <input  v-if="column.ContentType=='NUMBER'" v-on:keyup="listvaluechanged(column,item,index)"  class="form-control" type="number" v-model="item[column.field]" /> 
               <input  v-if="column.ContentType=='TEXT'"   v-on:keyup="listvaluechanged(column,item,index)"  class="form-control" type="text" v-model="item[column.field]" /> 
                
                </td>
          </tr>
      </tbody>
    </table>
</div>

<div id="footer">
  <div id="scanbtn">Cancel</div>
  <div id="firstbtn"  @click="SubmitBtnClick('SAVE')" >Save</div>
 </div>

    </div>
</template>

<script>

import hp from '../helper.js';
import ListComp from './ListComp.vue';



export default {
  name: 'app',
  data: function () { return {
    showHederBar:false,
    autocompleteValue:"",
    arryqurys:[],
    dataSourceArray:[],
    ListItems:[],
    ListData:[],
     items: [],
      columns: []
    }},
  methods:{
    savetrans:function()
    {
        let t = this;
        //let sale_time =hp.SSQL();
        let customer_id =hp.SSQL(hp.getcustinfo('CustNo'));
        let employee_id =hp.SSQL(hp.getcustinfo('AgentId'));
        let comment =hp.SSQL("test");
        let invoice_number =hp.SSQL("0012");
        let quote_number =hp.SSQL("0012");
        let sale_id =hp.SSQL("1");
        let sale_status =hp.SSQL("sales");
        let dinner_table_id =hp.SSQL("1");
        let work_order_number =hp.SSQL("0012");
        let sale_type =hp.SSQL("S");
        let SalesOrdNo =hp.SSQL("000012");

        let qry = "insert into sales (sale_time,customer_id,employee_id,comment,invoice_number,quote_number,sale_id,sale_status,dinner_table_id,work_order_number,sale_type,SalesOrdNo)";
        qry +="VALUES(datetime('now'),"+customer_id+","+employee_id+","+comment+","+invoice_number+","+quote_number+","+sale_id+","+sale_status+","+dinner_table_id+","+work_order_number+","+sale_type+","+SalesOrdNo+")";
        this.arryqurys.push(qry);
      $.each(this.ListData,function(k,v)
      {
        if(v.qty>0)
        {
          
          let sale_id = hp.SSQL("1");
          let item_id = hp.SSQL(v.item_id);
          let description =hp.SSQL(v.description);
          let serialnumber =hp.SSQL(v.serialnumber);
          let line = hp.SSQL("");
          let quantity_purchased = hp.SSQL(v.qty);
          let item_cost_price = hp.SSQL(v.unit_price);
          let item_unit_price = hp.SSQL(v.unit_price);
          let discount = hp.SSQL(v.discount);
          let discount_type =  hp.SSQL(v.discount);
          let item_location = hp.SSQL(v.item_location);
          let print_option = hp.SSQL("1");
          let SalesOrdNo = hp.SSQL("000012");


          let qry = "insert into sales_items (sale_id,item_id,description,serialnumber,line,quantity_purchased,item_cost_price,item_unit_price,discount,discount_type,item_location,print_option,SalesOrdNo) ";
          qry +="VALUES("+sale_id+","+item_id+","+description+","+serialnumber+","+line+","+quantity_purchased+","+item_cost_price+","+item_unit_price+","+discount+","+discount_type+","+item_location+","+print_option+","+SalesOrdNo+")";
          t.arryqurys.push(qry);
        }

        
      });
      
      //let bulkqry = hp.getBulkqry(this.arryqurys);
      let bulkqry = this.arryqurys;
      console.log("bulkqryfinal--->");
      console.log(bulkqry);
       hp.db.executeBulkSql(bulkqry,hp.DBobj,
            function(s){
                console.log("Bulkqry->"+JSON.stringify(s));
                
            },
            function(e){console.log(e);});


    },
      getitemslist: function (input) {
          let t=this;
          var SQL = hp.SqlReplace("select name,item_id from items",[]);
          hp.db.executeSql(SQL,hp.DBobj,
            function(s){
                //console.log("Autotest->"+JSON.stringify(s));
                t.dataSourceArray=s;
            },
            function(e){console.log(e);});
  },
  AutoChanged : function(e)
  {
    let t=this
    console.log("autochanges");
    console.log(e);
    console.log(e.dataItem);
    console.log(e.dataItem.item_id);
    let idata = e.dataItem;
    //getting item data for selected item 

     var SQL = hp.SqlReplace("select 1 as qty,SUM(1*unit_price) as total,* from items where item_id='"+idata.item_id+"'",[]);
       hp.db.executeSql(SQL,hp.DBobj,
            function(s){
                //console.log("Autotest->"+JSON.stringify(s));
                t.additem(s);
            },
            function(e){console.log(e);});



  },
  additem : function(idata)
  {
    if(this.ListData.length==0)
    {
      this.ListData = JSON.parse(JSON.stringify(idata));
    }
    else
    {
      let index =  this.ListData.findIndex(x => x.item_id === idata[0].item_id);
       console.log("index---->"+index);
      if(index>-1)
      {
        this.ListData[index].qty =  parseFloat(this.ListData[index].qty)+1
        let qty = parseFloat(this.ListData[index].qty);
        let unitprice = parseFloat(this.ListData[index].unit_price);
        console.log("qty---->"+qty);
        console.log("unitprice---->"+unitprice);
        let result =qty*unitprice;
        if(isNaN(result))
          result=0;
        this.ListData[index].total=result;
      }
      else
      {
       this.ListData.push(JSON.parse(JSON.stringify(idata[0])));
      }    
    }
   
                       console.log(this.ListData);
  },
   formattedDisplay: function (result) {
    return result.id + ' [' + result.Product_Text + ']'
  },
  itemselected : function(i)
  {
      console.log("Itemselected-->"+JSON.stringify(i))
  },
    rowitemclicked :function(data)
    {
      console.log("Rowitemclicked---->");
      console.log(data);
      this.DoAllAction("Rowitemclicked");
      
    },
    listvaluechanged : function(column,item,index)
    {
      
      console.log("listvaluechanged---->");
      console.log("index---->"+index);
      if(column.field=='qty')
      {
        //checking if qty have float value or any other carectr 
        let qty = parseInt(this.ListData[index].qty);
        if(!(qty.isInteger() && qty<0))
        {
          this.ListData[index].qty=0;
          return false;
        }
        
        qty = parseInt(this.ListData[index].qty);
        let unitprice = parseFloat(this.ListData[index].unit_price);
        console.log("qty---->"+qty);
        console.log("unitprice---->"+unitprice);

        this.ListData[index].total=(qty*unitprice) || 0;
        this.$forceUpdate()
         console.log("data---->"+JSON.stringify(this.ListData[index]));
      }
      
      //this.DoAllAction("listvaluechanged");
    },
      SubmitBtnClick:function()
      {
        //validate
        if(this.ListData.length<=0)
        {
          this.navigator.alert("There is no item to save!");
          return false;
        }
        else
        {
          this.savetrans();
        }
      },
      getListData : function()
      {
        var prams = this.$route.params;
        var t = this;
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select QueryText from QueryConfig where ScreenName='"+prams.ScreenName+"'",[]);
         hp.db.executeSql(SQL,hp.DBobj,
            function(s){
              console.log("List Query---->");
                console.log(s);
                var Qsql = s[0].QueryText;
                var SQL = hp.SqlReplace(Qsql,[]);
                console.log(SQL);
                  hp.db.executeSql(SQL,hp.DBobj,
                 function(s){
                   console.log("List DATA---->");
                  t.ListData = JSON.parse(JSON.stringify(s))
                       console.log(t.ListData);
                 },
                 function(e){
                   console.log("Save Query False");
                 });
            },
            function(e){console.log(e);});
      },
      loadListConfig:function()
      {
        var prams ={ScreenName:'Sales'};
        //var db = cordova.plugins.filemodesqlite;
        var SQL = hp.SqlReplace("select * from listview where Screenname='"+prams.ScreenName+"' order by DisplayNo",[]);
        hp.db.executeSql(SQL,hp.DBobj,this.querySuccess,this.queryError);
      },
      queryError : function(e)
      {
          console.log("Error " + e);
      },
      querySuccess : function(Resultset)
      {
        console.log(Resultset);
        this.ListItems=Resultset;
         for (let a of this.ListItems)
          {
            let w = hp.isor(a.width,200);
            let ContentType =  hp.isor(a.ContentType,"TEXT");
            //let ha = {style: "text-align: right; font-size: 14px;color:red"}
            let jobject =  {
              editable: true,
              field: a.DataMember,
              title: a.Title,
              width:w,
              headerClassName:'Myclass',
              ContentType:ContentType
              }
            this.columns.push(jobject);
          }
        console.log("Listconfig");
        console.log(this.columns);
      },
      DoAllAction : function(code)
      {
        if(this.ActionList.length!=0)
        {
          for (let a of this.ActionList)
          {
            if(code==a.ActionName)
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
      },
      W_Load : function()
      {
        this.DoAllAction("W_ONLOAD");
      }
    },
      created: function () {
        
        this.loadActions();
        this.loadMsgData();
        
        //this.W_Load();
    
  },
  beforeMount() {
    this.loadListConfig();
  this.getListData();
  this.getitemslist();
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
.Myclass
{
  font-size: 14px;
  color: red;
}

.pr-12 {
    padding-right: 12px !important;
}

.mb-20 {
    margin-bottom: 20px !important;
}

.b-1 {
    border: 1px solid #ebebeb !important;
}

.card {
    border: 0;
    border-radius: 0;
    margin-bottom: 30px;
    -webkit-transition: .5s;
    transition: .5s;
}

.card {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid rgba(0,0,0,.125);
    border-radius: .25rem;
}

.media {
    padding: 16px 12px;
    -webkit-transition: background-color .2s linear;
    transition: background-color .2s linear;
}

.media {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    align-items: flex-start;
}

.card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem;
}

.media .avatar {
    flex-shrink: 0;
}

.no-radius {
    border-radius: 0 !important;
}

.avatar-xl {
    width: 64px;
    height: 64px;
    line-height: 64px;
    font-size: 1.25rem;
}

.avatar {
    position: relative;
    display: inline-block;
    width: 36px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 100%;
    background-color: #f5f6f7;
    color: #8b95a5;
    text-transform: uppercase;
}

img {
    max-width: 100%;
}

img {
    vertical-align: middle;
    border-style: none;
}

.mb-2 {
    margin-bottom: .5rem!important;
}

.fs-20 {
    font-size: 20px !important;
}

.pr-16 {
    padding-right: 16px !important;
}

.ls-1 {
    letter-spacing: 1px !important;
}

.fw-300 {
    font-weight: 300 !important;
}

.fs-16 {
    font-size: 16px !important;
}

.media-body>* {
    margin-bottom: 0;
}

small, time, .small {
    font-family: Roboto,sans-serif;
    font-weight: 400;
    font-size: 11px;
    color: #8b95a5;
}

.fs-14 {
    font-size: 14px !important;
}

.mb-12 {
    margin-bottom: 12px !important;
}

.text-fade {
    color: rgba(77,82,89,0.7) !important;
}

.card-footer:last-child {
    border-radius: 0 0 calc(.25rem - 1px) calc(.25rem - 1px);
}

.card-footer {
    background-color: #fcfdfe;
    border-top: 1px solid rgba(77,82,89,0.07);
    color: #8b95a5;
    padding: 10px 20px;
}

.flexbox {
    display: -webkit-box;
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
}

.align-items-center {
    -ms-flex-align: center!important;
    align-items: center!important;
}

.card-footer {
    padding: .75rem 1.25rem;
    background-color: rgba(0,0,0,.03);
    border-top: 1px solid rgba(0,0,0,.125);
}


.card-footer {
    background-color: #fcfdfe;
    border-top: 1px solid rgba(77, 82, 89, 0.07);
    color: #8b95a5;
    padding: 10px 20px
}

.card-footer>*:last-child {
    margin-bottom: 0
}

.hover-shadow {
    -webkit-box-shadow: 0 0 35px rgba(0, 0, 0, 0.11);
    box-shadow: 0 0 35px rgba(0, 0, 0, 0.11)
}

.fs-10 {
    font-size: 10px !important;
}
      
</style>
