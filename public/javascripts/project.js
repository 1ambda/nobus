var teamName;

$(function() {
	getProjectName();
	$('#btnLogout').click(btnLogoutAction);
	$('#inputInviteMember').keyup(inputInviteMemberChange);
	$('#inputInviteMember').typeahead({
		source : inputInviteMemberTypeahead
	});
});

function inputInviteMemberTypeahead(query, process) {

	console.log("1");

	$.ajax({
		type : "get",
		url : "/project/inviteMemberTypeahead",
		data : {
			user_id : query
		},
		success : function(data) {
			return process(data);
		}
	});
};

function inputInviteMemberChange() {
	if ($('#inputInviteMember').val() == "") {
		$("#btnInviteMember").addClass('disabled');
	} else {
		$("#btnInviteMember").removeClass('disabled');
	}
};

var btnLogoutAction = function() {
	$.ajax({
		type : 'get',
		url : '/welcome/logout',
		success : function(data) {
			$(location).attr('href', '/');
		}
	});
};

function getProjectName() {
	$.ajax({
		type : 'get',
		url : '/project/getProjectName',
		success : function(data) {
			$('#projectName').text(data.project_name);
		}
	});
};

function openInviteDialog() {
	$('#dialogInviteMember').modal({
		backdrop : false,
		keyboard : true
	});
};

function inviteMember() {
	alert("invite Member");
};

