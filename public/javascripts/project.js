var teamName;

$(function() {
	getProjectName();
	$('#btnLogout').click(btnLogoutAction);
	$('#inputInviteMember').keyup(inviteMemberChange);
	$('#inputDropout').keyup(dropoutChange);
	$('#inputInviteMember').typeahead({
		source : inviteMemberTypeahead
	});
});

function pushAction() {
	$('#dialogPush').modal('hide');
	alert("Push not implemented");
};

function dropoutAction() {
	$('#dialogDrop').modal('hide');
	alert("Dropout not implemented");
};

function dropoutChange() {
	
	var str = $('#inputDropout').val();
	console.log(str.toLowerCase());
	
	if ( str.toLowerCase() == "drop") {
		$("#btnDropout").removeClass('disabled');
	} else {
		$("#btnDropout").addClass('disabled');
	}
};

function inviteMemberTypeahead(query, process) {

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
function inviteMemberChange() {
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

function openPushDialog() {
	$('#dialogPush').modal({
		backdrop : false,
		keyboard : true
	});
};

function openTossDialog() {
	alert("dialog not implemented");
};

function openReturnDialog() {
	alert("dialog not implemented");
};

function inviteMemberAction() {
	$('#dialogInviteMember').modal('hide');
	alert("invite Member");
};

function openDropDialog() {
	$('#dialogDrop').modal({
		backdrop : false,
		keyboard : true
	});
}

