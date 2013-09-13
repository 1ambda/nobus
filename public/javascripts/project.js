var teamName;

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

	testFunction();
});

function loadPageContents(tmpl) {
	$("#pageContainer").html($('#' + tmpl).html());
};

function getUserID() {
	$.ajax({
		type : 'get',
		url : '/welcome/getUserID',
		success : function(result) {
			$('#divUserID').text(result.id);
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
	alert("Push not implemented");
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
	json["user_id"] = newMember;
	console.log(json);
	$('#dialogInviteMember').modal('hide');
	$.ajax({
		type: 'post',
		url: '/project/inviteMemberAction',
		data: json,
		success: function(){
			alert("invite"+newMember);
		}
	});
};

function openDropDialog() {
	$('#dialogDrop').modal({
		backdrop : false,
		keyboard : true
	});
}

