const axios = require('axios').default;
module.exports = {
    DBurl:"http://cosmicwebs.in/demo/btapp/config.sqlite",
    RootFolder:"com.bt.app",
    DBobj:{"DBname":"config.sqlite","RootFolder":"com.bt.app"},
    db:"",
    UserData:[],
    GetHostURL : function()
    {
        var storage = window.localStorage;
        var value = storage.getItem("HOSTURL"); // Pass a key name to get its value.
        console.log("HOSTURL-->"+value)
        return value;
    },
    SetHostURL : function(value)
    {
        var storage = window.localStorage;
        storage.setItem("HOSTURL", value)
    },
    checkURLvalid : async function(url)
    {
        return  axios.post(url+"/api", {
            "Method":"checkURL",
            "Key":"123123",
            "Data":""
        })
  .then(function (response) {
    // handle success
    console.log("response----------->");
    console.log(response);
    console.log(response.data.Status);
    if(response.data.Status==true)
    {
        return true;
    }
    else
    {
        return false;
    }
  }).catch(function (error) {
    console.log(error);
    return false;
  })
  
    },
    RStoJsonArry: function(rs)
    {
        var jobj = [];
        for (let d of rs)
        {
            jobj.push(d); 
        }
            return jobj;
    },
    getForReplace: function(Fdata)
    {
        var r = {};
        for (let f of Fdata)
        {
            r[f.FieldName]=f.DefaultValue
        }
        console.log(r);
        return r;

    },
    SqlReplace: function(SQL,Data)
    {
        Data=JSON.parse(JSON.stringify(Data))
        var found = [],          // an array to collect the strings that are found
        rxp = /{([^}]+)}/g,
        //str = "a {string} with {curly} braces",
        curMatch;

            while( curMatch = rxp.exec( SQL ) ) {
                found.push( curMatch[1] );
            }
            //console.log( found );
            //console.log( Data );
            for (let f of found)
            {
                f = f.toString();
                SQL=SQL.replace("{"+f+"}",  Data[f]);
            }
            return SQL;
    },
    getOptionData: function(qry,successCallback, errorCallback)
    {  var hp = this;
        hp.db.executeSql(qry,hp.DBobj,
            function(success){
                hp.db.executeSql(success[0].QueryText,hp.DBobj,
                    function(finalresult){
                        successCallback(finalresult);
                    },errorCallback);
            },errorCallback);
       
    }
    
    
    
}