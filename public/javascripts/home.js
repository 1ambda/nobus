$(function() {
    $('#btnLogin').button().click(btnLoginAction);
    $('#btnRegister').button().click(btnRegisterAction);
})

var btnRegisterAction = function() {
    var userID = $('#inputUserID').val() || "";
    var userPwd = $('#inputUserPwd').val() || "";
    
    if ( (userID === "") || (userPwd === "") ) {
        alert("Insert Your Information!");    
    } else {
        
        var json = {};
        json["user_id"]  =  userID;
        json["user_pwd"] =  userPwd; 
        
        $.ajax({ 
            type:       'post',
            url:        'register',
            data:       json,
            success:    function(result) {
                alert(result.status);
            }    
        });
    }
}

var btnLoginAction = function() {
    
    var userID = $('#inputUserID').val() || "";
    var userPwd = $('#inputUserPwd').val() || "";
    
    if ( (userID === "") || (userPwd === "") ) {
        alert("Insert Your Information!");    
    } else {
        
        var json = {};
        json["user_id"]  =  userID;
        json["user_pwd"] =  userPwd; 
        
        $.ajax({ 
            type:       'post',
            url:        'login',
            data:       json,
            success:    function(result) {
                console.log("2");
                if ( result.status == "FAIL" ) {
                    alert('Not Registered or Password incorrect');    
                } else if ( result.status == "SUCCESS" ) {
                    $(location).attr('href', '/welcome');
                }
            }    
        });
    }
}