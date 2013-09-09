$(function() {
	getProjectName();
	$('#btnLogout').click(btnLogoutAction);
	$('#dialogInviteMember').hide();
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

function getProjectName() {
	$.ajax({
		type: 'get',
		url: '/project/getProjectName',
		success: function(data) {
			$('#projectName').text(data.project_name);
		}
	});
};

function openInviteDialog() {
	$('#dialogInviteMember').modal({
		backdrop: false,
		keyboard: true
	});
};

function inviteMember() {
	alert("invite Member");
};
