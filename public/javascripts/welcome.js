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
	        		li[i++] = '<li><a href="javascript:selectProject();">' + v.name+ '</a></li>';
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
    			
    			var json = {};
    			json["team_name"] = $('#teamName').val();
    			
    			if ( json["team_name"] == "" ) {
    				alert("Insert Team Name!");
    				return;
    			}
    				
    			$.ajax({
    				type: "post",
    				url: "/welcome/createTeam",
    				data: json,
    				success: function(result) {
    					if ( result.status === "success" ) {

    						var li = '<li><a href="javascript:selectProject();">' 
    						+ json["team_name"] + '</a></li>';
    						
    						$('#ulProjectList').append(li);
    						
    						// or you can getTeamList();
    						
    						// websocket!!!!
    						
    					} else if ( result.status === "error"){
    						alert("'POST : createTeam' return error");		
    					}
    				}
    			});
    			
    			$(this).dialog("close");
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









