var teamName;
$(function() {
	getProjectName();
	
});

function getProjectName() {
	$.ajax({
		type : 'get',
		url : '/project/getProjectName',
		success : function(data) {
			$('#projectName').text(data.project_name);
			teamName = data.project_name;
		}
	});
};

function openInviteDialog() {
	$('#inviteMember').modal({
		backdrop : true,
		keyboard : true
	});
};

function openDeleteDialog() {
	$('#deleteProject').modal({
		backdrop : true,
		keyboard : true
	});
};

function inviteMember() {

	var json = {};
	json["invite_member"] = $('#inputInviteMember').val();
	json["team_name"] = teamName;

	if (json["invite_member"] == "") {
		alert("Insert Your Member Name");
		return;
	}

	$.ajax({
		type : 'post',
		url : '/welcome/inviteMember',
		data : json,
		success : function() {
			$(location).attr('href', '/');
		}
	});
	//확인해서 아이디가 있을때 없을 떄
	console.log(json);
};

function deleteProject() {

	var json = {};
	json["team_name"] = teamName;

	var check = $('#inputDeleteProject').value();
	if (check == "delete" || check == "DELETE") {
		//지울수 있는지 권한?
		//지우는 라우팅
	} else {
		alert("Input \"Delete\"");
		return;
	}
};