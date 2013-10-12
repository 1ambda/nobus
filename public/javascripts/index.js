/**
 * Created by Administrator on 13. 10. 9.
 */
$(function() {
    $('#btnLogin').button().click(btnLoginAction);
    $.ajax({
        type: 'get',
        url: '/test/testAsync',
        success : function() {

        }
    });
});

function btnLoginAction(){
    var userID = $('#inputUserId').val() || "";
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
                if ( result.status == "FAIL" ) {
                    alert('Not Registered or Password incorrect');
                } else if ( result.status == "SUCCESS" ) {
                    $(location).attr('href', '/welcome');
                }
            }
        });
    }
};

