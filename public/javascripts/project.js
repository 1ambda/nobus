$(function() {
	getProjectName();
});

function getProjectName() {
	$.ajax({
		type: 'get',
		url: '/project/getProjectName',
		success: function(data) {
			$('#projectName').text(data.project_name);
		}
	});
};
