$(function() {
    getUserID();
    getTeamList();
    $('#btnLogout').click(btnLogoutAction);
    // createDialog();
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
        	console.log("getTeamList");
        	if ( teams.length > 0 ) {
	        	var li = [];
	        	var i = 0;
	        	
	        	$.each(teams, function(k, v) {
	        		li[i++] = '<li><a href="#" class="projectList">' + v.name+ '</a></li>';
	        	});
	        	$('#ulProjectList').empty();
	        	$('#ulProjectList').append(li.join(''));
			    $('.projectList').click(projectSelected);
        	}
        }
    });
};
function openDialog(){
	$('#bootModal').modal({
		backdrop: false,
		keyboard: true
	});
};

function createTeam() {
	
	var json = {};
	json["team_name"] = $('#inputTeamName').val();
	
	if ( json["team_name"] == "" ) {
		alert("Insert Your Team Name");
		return;
	}
	
	$.ajax({
		type: 'post',
		url: '/welcome/createTeam',
		data: json,
		success: function() {
			getTeamList();
		}
	});
}

function projectSelected() {

	var json = {};
	json["project_name"] = $(this).text();
	
	$.ajax({
		type: "post",
		url: "/welcome/projectSelected",
		data : json,
		success: function(result) {
			$(location).attr('href', '/project');
		}
	});
};

function deleteProjcet() {
	$(location).attr('href', '/welcome/deleteProject');
};








