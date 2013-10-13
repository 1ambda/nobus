$(function() {
	getUserID();
	getTeamList();
	$('#btnLogout').click(btnLogoutAction);
	$('#btnNewProject').click(btnNewProjectAction);
});



var btnLogoutAction = function() {
	$.ajax({
		type : 'get',
		url : '/welcome/logout',
		success : function(data) {
			$(location).attr('href', '/');
		}
	});
};

function getUserID() {
	$.ajax({
		type : 'get',
		url : '/welcome/getUserID',
		success : function(result) {
			$('#textUserId').text(result.id);
		}
	});
};

function getTeamList() {
	$.ajax({
		type : 'get',
		url : '/welcome/getTeamList',
		success : function(teams) {
			
            $('#divProjectList').empty();
			
			$('#tmplProjectList').tmpl({ teams : teams }).appendTo('#divProjectList');
			
			$('.list-for-project').click(projectSelected);
		}
	});
};
function btnNewProjectAction() {
	$('#dlgCreateTeam').modal({
		backdrop : true,
		keyboard : true
	});
};

function createTeamAction() {

	var json = {};
	json["team_name"] = $('#inputTeamName').val();

	if (json["team_name"] == "") {
		alert("Insert Your Team Name");
		return;
	}

	$.ajax({
		type : 'post',
		url : '/welcome/createTeam',
		data : json,
		success : function() {
			getTeamList();
            $('#dlgCreateTeam').modal('hide');
		}
	});


}

function projectSelected() {

	var json = {};
	json["project_name"] = $(this).find('h5').text();
	json["team_id"] = $(this).attr('id');
	
	$.ajax({
		type : "post",
		url : "/welcome/projectSelected",
		data : json,
		success : function(result) {
			$(location).attr('href', '/project');
		}
	});
};

