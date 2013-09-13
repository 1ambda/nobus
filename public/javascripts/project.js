var teamName;
var user_id;

$(function() {
	getProjectName();
	getUserID();

	$('#btnLogout').click(btnLogoutAction);
	$('#inputInviteMember').keyup(inviteMemberChange);
	$('#inputDropout').keyup(dropoutChange);
	$('#inputInviteMember').typeahead({
		source : inviteMemberTypeahead
	});

	$('#datepicker').datepicker();
	$('#datepicker2').datepicker();

	loadPageContents('tmplGantt');

	var map = {};
	map["tabGantt"] = "tmplGantt";
	map["tabContribution"] = "tmplContribution";
	map["tabComment"] = "tmplComment";

	$('#tabGantt, #tabContribution, #tabComment').click(function() {
		loadPageContents(map[this.id]);
	});
	// testFunction();
});

function getMemberList() {
	
	var data = [
	{ user_name : "dbwkck", task_number : 1, status : "Offline" },
	{ user_name : "scene", task_number : 2, status : "Online" }
	];
	
	$('#tmplTeam').tmpl(data).appendTo('#dialogMemberList tbody');
	
	$('#dialogMemberList').modal({
		backdrop : false,
		keyboard : true
	});
};

function insertTask() {
	// Sample function for PUSH
	
	console.log("1");
	
	var data = [
		{ task_name : "Search OS", person : "Hoon", due_date: "09-28" }
	];
	
	$('#tmplTask').tmpl(data).appendTo('#pageContainer');
};

function loadPageContents(tmpl) {
	$("#pageContainer").html($('#' + tmpl).html());
};

function getUserID() {
	$.ajax({
		type : 'get',
		url : '/welcome/getUserID',
		success : function(result) {
			$('#divUserID').text(result.id);
			user_id = result.id;
		}
	});
};

function testFunction() {
	$.ajax({
		type : 'post',
		url : '/project/test',
		success : function() {
		}
	});
};

function pushAction() {
	$('#dialogPush').modal('hide');
	var test = $('#pushMember').val();
	console.log(test);
};

function dropoutAction() {
	$('#dialogDrop').modal('hide');
	$.get('/project/dropout', function(data) {
		$(location).attr('href', 'welcome');
	});
};

function dropoutChange() {

	var str = $('#inputDropout').val();
	console.log(str.toLowerCase());

	if (str.toLowerCase() == "drop") {
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
	var json = {};
	var newMember = $('#inputInviteMember').val();
	if(user_id == newMember){
		alert("That's you");
		return;
	}
	json["user_id"] = newMember;
	console.log(json);
	$('#dialogInviteMember').modal('hide');
	$.ajax({
		type: 'post',
		url: '/project/inviteMemberAction',
		data: json,
		success: function(result){
			if( result.status == "fail" ) {
				alert("Already invited : " + newMember);
			} else {
				alert("Successfully invited : " + newMember);
			}
		}
	});
};

function openDropDialog() {
	$('#dialogDrop').modal({
		backdrop : false,
		keyboard : true
	});
}
