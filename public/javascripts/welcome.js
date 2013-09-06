$(function() {
    getUserID();
    getTeamList();
    $('#btnLogout').button().click(btnLogoutAction);
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
	$('#bootModal').modal({
		backdrop: false,
		keyboard: true
	});
};

function selectProject() {
	$(location).attr('href', '/welcome/selectProject');
};









