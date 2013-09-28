var teamName;
var user_id;
var pushMemberId = new Array();
$(function() {
	getProjectName();
	getUserID();
	$(".chosen").chosen();
	$('#btnLogout').click(btnLogoutAction);
	$('#inputInviteMember').keyup(inviteMemberChange);
	$('#inputDropout').keyup(dropoutChange);
	$('#inputInviteMember').typeahead({
		source : inviteMemberTypeahead
	});
	var pickerOpts = {
		format: "yyyy-mm-dd",
		changeYear: true,
		defaultDate: new Date()
	};
	$('#datepicker').datepicker(pickerOpts);
	$('#datepicker2').datepicker(pickerOpts);

	var map = {};
	map["tabGantt"] = getTaskList;
	map["tabContribution"] = getContribution;
	map["tabComment"] = getCommentList;

	$('#tabGantt, #tabContribution, #tabComment').click(function() {
		map[this.id]();
	});
	
	// Not Fully impl
	// We need to work.
	getTaskList();
	
	// testFunction();
});

function getContribution() {
	$("#pageContainer").html($('#tmplContribution').tmpl());
};

function getCommentList() {
	$("#pageContainer").html($('#tmplComment').tmpl());
};

function getMemberList() {

	// Query

	$('#dialogTeam table tbody').remove();

	$.ajax({
		type : 'get',
		url : '/project/getTeamMembers',
		success : function(result) {
			if (result.status == "fail") {
				alert("Error : getTeamMembers");
				return;
			}
			
			result.data[0] = { user_id : "Hoon", task_number : "5", status : "online" };
			result.data[1] = { user_id : "Min", task_number : "2", status : "offline" };
			result.data[2] = { user_id : "JH", task_number : "1", status : "online" };
			
			$.get('/template/dialogTeam', function(templates) {
				$('body').append(templates);
				$('#tmplDialogTeamContent').tmpl(result.data).appendTo('#dialogTeam table:last');
				$('#dialogTeam').modal({
					backdrop : false,
					keyboard : true
				});
			});
		}
	});
};

function getTaskList() {
	
	var task = [
		{ taskList_name : "My Tasks", taskBoxes : [
			{ taskbox_name : "Research" , taskElems : [
				{ task_kind : "Push", member: "Hoon", duedate: "09.28", taskMembers : [
					{ co_worker : "Hoon", current_user : "true"}
				]}
			]}, 
			{ taskbox_name : "Presentation" , taskElems : [
				{ task_kind : "Push", duedate: "09.28", taskMembers : [
					{ co_worker : "Ho"},
					{ co_worker : "Hoon", current_user : "true"},
					{ co_worker : "Eun"}
				]},
				{ task_kind : "Return", duedate: "10.28", taskMembers : [
					{ co_worker : "Lee"},
					{ co_worker : "Hoon", current_user : "true"}
				]}
			]}
		]},
		{ taskList_name : "Others", taskBoxes : [
			{ taskbox_name : "UCC" , taskElems : [
				{ task_kind : "Push", member: "Lee", duedate : "09.27", taskMembers : [
					{ co_worker : "Jin" }
				]},
				{ task_kind : "Toss", member: "Ho", duedate : "09.28", taskMembers : [
					{ co_worker : "Mun" }
				]},
				{ task_kind : "Return", member: "Mun", duedate : "09.29", taskMembers : [
					{ co_worker : "Lee" }
				]}
			]}
		]}
	];

	// $('#tmplTaskList').tmpl(task).appendTo('#pageContainer');
	$('#pageContainer').html($('#tmplTaskList').tmpl(task));
	
	$('.task-elem').click(function(event) {
		// alert($(this).children('#taskelem_member').text());
		
			openTaskDialog();
		
	});
	
	$('.taskelem-select').click(function(event) {
		event = event || window.event;
		if(event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = false;
		}
	});
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
	var json = {};
	//send push data in json
	//pushTitle, pushText, start_date, due_date, user_id
	json['pushTitle'] = $('#inputPushTitle').val();
	// json['pushDescription'] = $('#pushText').val();
	json['name'] = $('#pushText').val();
	json['start_date'] = $('#inputStartDate').val();
	json['due_date'] = $('#inputDueDate').val();
	json['user_id'] = new Array();
	json['user_id']= pushMemberId;
	console.log(json);
	$.ajax({
		type : 'post',
		url : '/project/pushTask',
		data : json,
		success : console.log(json)
	});
	
	pushMemberId = [];
	console.log(pushMemberId);
};

function dropoutAction() {
	$('#dialogDrop').modal('hide');
	$.get('/project/dropout', function(data) {
		$(location).attr('href', 'welcome');
	});
};

function dropoutChange() {

	var str = $('#inputDropout').val();

	if (str.toLowerCase() == "drop") {
		$("#btnDropout").removeClass('disabled');
		$("#btnDropout").attr('href', 'javascript:dropoutAction();');
	} else {
		$("#btnDropout").addClass('disabled');
		$("#btnDropout").attr('href', '#');
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
		$("#btnInviteMember").attr('href', '#');
	} else {
		$("#btnInviteMember").removeClass('disabled');
		$("#btnInviteMember").attr('href', 'javascript:inviteMemberAction();');
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

function openTaskDialog() {
	
	var data = {
		title: "Search Images",
		description : "we need sexy girls",
		taskMembers : [
			{ user_id : "Hoon", status : "online"},
			{ user_id : "Lee", status : "online"},
			{ user_id : "Jung", status : "online"}
		]
	};

	$.get('/template/dialogTask', function(templates) {
		$('body').append(templates);
		$('#tmplDialogTask').tmpl(data).appendTo('body');
		$(".taskelem-select").on('click', function(event) {
			event.preventDefault();
		});
		$('#dialogTask').modal({
			backdrop : false,
			keyboard : true
		});
	});
};

function openPushDialog() {

	$('#pushMember option').remove();
	$('#placeAddMemberButton button').remove();
	console.log(pushMemberId.length);
	pushMemberId = [];
	$.ajax({
		type : 'get',
		url : '/project/getTeamMembers',
		success : function(result) {
			if (result.status == "fail") {
				alert("Error : getTeamMembers");
				return;
			}
			$("<option></option>").attr("value", "").appendTo('#pushMember');
			$.each(result.data, function(k, v) {
				$("<option></option>").attr("value", v.user_id).text(v.user_id).appendTo("#pushMember");
			});
			console.log($('#pushMember').val());
			$('#pushMember').trigger("liszt:updated");
			$('#dialogPush').modal({
				backdrop : false,
				keyboard : true
			});
		}
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
	if (user_id == newMember) {
		alert("That's you");
		return;
	}
	json["user_id"] = newMember;
	console.log(json);
	$('#dialogInviteMember').modal('hide');
	$.ajax({
		type : 'post',
		url : '/project/inviteMemberAction',
		data : json,
		success : function(result) {
			if (result.status == "not_exist") {
				alert("There is no person like '" + newMember + "'");
			} else if (result.status == "fail") {
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

function addPushMember(val) {
	var sep = $.inArray(val, pushMemberId);
	sep=sep+1;
	if (!sep) {
		pushMemberId.push(val);
		var icon = val + " <i class=\"icon-remove-sign\"></i>";
		var id = val;
		var onClick = "javascript:deleteButton("+id+");";
		$("<button></button>").attr("id", id).attr("onClick",onClick).attr("class", "btn btn-primary btnMember").html(icon).appendTo("#placeAddMemberButton");
	}
	else{
		console.log("Member is already added");
		return;
	}

}

function deleteButton(id){
	var templ = $.inArray(id.id, pushMemberId);
	pushMemberId.splice($.inArray(id.id, pushMemberId),1);
	$('#'+id.id).remove();
}
