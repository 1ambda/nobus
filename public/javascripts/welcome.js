$(function() {
	$('#dialogCreateTeam').hide();
    getUserID();
    $('#btnLogout').button().click(btnLogoutAction);
    $('#dialogCreatTeam').dialog();
    createDialog();
});

var btnLogoutAction = function() {
    $.ajax({
        type:   'get',
        url:    '/welcome/logout',
        success: function(data) {
            $(location).attr('href', '/');   
        }
    });
};

function getUserID() {
    $.ajax({
        type:   'get',
        url:    '/welcome/getUserID',
        success:    function(result) {
            $('#divUserID').text(result);
        }
    });
};

function getTeamList() {
    $.ajax({
        type:   'get',
        url:    '/welcome/getTeamList',
        success:    function(teams) {
            alert("Response: getTeamList");
        }
    });
};
function openDialog(){
	$('#dialogCreateTeam').dialog("open");
    
};
function createDialog(){
	$("#dialogCreateTeam").dialog({
    	autoOpen: false,
    	height: 300,
    	width: 350,
    	modal: true,
    	buttons: {
    		"Create" : function(){
    			console.log("hi");	
    		},
    		
    		"Cancel" : function(){
    			$(this).dialog("close");
    		}
    	},
    	close: function(){
    		$(this).dialog("close");
    	}
    });
};
