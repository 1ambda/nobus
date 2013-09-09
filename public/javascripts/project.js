$(function() {
	getProjectName();
	$('#btnLogout').click(btnLogoutAction);
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
