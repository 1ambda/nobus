$(function() {
    getUserID();
    getTeamList();
    $('#btnLogout').button().click(btnLogoutAction);
    $('#dialogCreateTeam').hide();
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
	console.log("1231");
    $.ajax({
        type:   'get',
        url:    '/welcome/getUserID',
        success:    function(result) {
            $('#divUserID').text(result);
        }
    });
};

function getTeamList() {
	console.log("123");
    $.ajax({
        type:   'get',
        url:    '/welcome/getTeamList',
        success:    function(teams) {
        	console.log("getTeamList");
        	if ( teams.length > 0 ) {
	        	var li = [];
	        	var i = 0;
	        	
	        	$.each(teams, function(k, v) {
	        		li[i++] = '<li>' + v.name + '</li>';
	        	});
	        	
	        	$('#ulProjectList').append(li.join(''));
        	}
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

function selectProject() {
	$(location).attr('href', '/welcome/selectProject');
};









