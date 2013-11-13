var team_name;
var user_id;
var team_id;
var pushMemberId = new Array();
$(function() {

	getProjectName();
	getUserID();
	$(".chosen").chosen();
	$('#btnLogout').click(btnLogoutAction);

	getTaskList();

    // commentSocketInit();
});

function commentSocketInit() {
    var comment = io.connect('http://localhost/comment');

    comment.on('connect', function() {

        log.debug(team_id);
        // get chatting log;
        $.ajax({
            type: 'get',
            url: '/project/comments/' + team_id,
            success : function(data) {
                log.debug(data);
                log.debug(data[0]);
                log.debug(data[0].comment);
            }
        });
    });


    comment.on('disconnect', function() {

    });


};
// connected with 'etc' button
function testAction() {
	// for Logging
	// Click F2!!! and then  etc button
	
  	log.debug( 'this is a debug message' );
	log.info( 'this is an info message' );
	log.warn( 'this is a warning message' );
	log.error( 'this is an error message' );
	
	log.profile( 'generate test string' );

	var testContent = '';
	for (var i = 0; i < 3000; i++) {
		testContent += '-';
	}

	log.profile('generate test string'); 

	// end for Logging
	
}

function getContribution() {
	$("#pageContainer").html($('#tmplContribution').tmpl());

    $("body").removeClass('comment')
};

function getCommentList() {
	$("#pageContainer").html($('#tmplComment').tmpl());

    $("body").addClass('comment')
};

function openDropDialog() {
	$.get('/template/dlgDrop', function(template) {
		
		$('body').append(template);
		$('#inputDropout').keyup(dropoutChange);
		$('#dlgDrop').modal({
			backdrop : true,
			keyboard : true
		});
	});
};

function getMemberList() {

	// Query

	$('#dlgMemberList table tbody').remove();

	$.ajax({
		type : 'get',
		url : '/project/getTeamMembers',
		success : function(result) {
			if (result.status == "fail") {
				alert("Error : getTeamMembers");
				return;
			}
			
			// result.data[0] = { user_id : "Hoon", task_number : "5", status : "online" };
            for(var i = 0; i < result.data.length; i++) {
                result.data[i]["task_number"] = i;
                result.data[i]["status"] = "online";
            }

			$.get('/template/dlgMemberList', function(templates) {
				
				
				log.debug(JSON.stringify(result));
				
				$('body').append(templates);
				$('#tmplDialogTeamContent').tmpl(result.data).appendTo('#dlgMemberList table:last');
				$('#dlgMemberList').modal({
					backdrop : true,
					keyboard : true
				});
			});
		}
	});
};

function getTaskList() {
    $("body").removeClass('comment')

    $.ajax({
        type : 'get',
        url : '/project/getTaskList',
        success : function(result) {
            console.log('1');
            console.log(result);
            $('#gantt').html($('#tmplTaskList').tmpl(result));

            $(".taskelem-select").on('click', function(event) {
                event.preventDefault();
            });
            $('.taskelem-select').click(function (event) {
                event = event || window.event;
                if (event.stopPropagation) {
                    event.stopPropagation();
                } else {
                    event.cancelBubble = false;
                }
            });
        }
    });
};


function getUserID() {
	$.ajax({
		type : 'get',
		url : '/welcome/getUserID',
		success : function(result) {
			$('#textUserId').text(result.id);
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
			log.debug(data.team_name);
			console.log(JSON.stringify(data));
			
			
            $('#divProjectName').text(data.team_name);
            team_id = data.team_id;
            team_name = data.team_name;
            user_id = data.user_id;
		}
	});
};

function openInviteDialog() {
	
	$.get('/template/dlgInvite', function(template) {
		$('body').append(template);

        $('#inputInviteMember').keyup(InputMemberChecker);
		$('#inputInviteMember').typeahead({
			remote: '/project/inviteMemberTypeahead?user_id=%QUERY'
		});

		$('#dlgInvite').modal({
		backdrop : true,
		keyboard : true
	});
		
	});
	
};

function InputMemberChecker() {
    if ($('#inputInviteMember').val() == "") {
        $('#btnInviteMember').addClass('disabled');
        $('#btnInviteMember').attr('href', '#');
    } else {
        $('#btnInviteMember').removeClass('disabled');
        $('#btnInviteMember').attr('href', 'javascript:inviteMemberAction();');
    }
};

function openPushDialog() {

    $('#alertBoxPushMember').html('');

    $.ajax({
        type : 'get',
        url : '/template/dlgPush',
        success : function(templates)
        {
            $('body').append(templates);
            $('#dpPush').datetimepicker({
                pickTime: false
            });

            $('#inputPushMember').typeahead({
                remote: '/project/TaskMemberTypeahead?user_id=%QUERY'
            });

            $('#btnPush').click(function() {
                var due_date = $('#inputPushDuedate').val();
                var title = $('#inputPushTitle').val();
                var desc = $('#taPushDesc').val();
                var members = new Array();

                $('#alertBoxPushMember').children().each(function() {
                    members.push($(this).text());
                });

                    $.ajax({
                        url : '/project/pushAction',
                        type: 'post',
                        data: { due_date : due_date, title : title, desc : desc,
                            members : members },
                        success : function(result) {
                            if(result.status === "success") {
                                return true;
                            }

                            return false;
                        }
                    });
            });

            $('#inputPushTitle, #taPushDesc').on('keyup', pushDataChecker);
            $('#alertBoxPushMember').on('change', pushDataChecker);
            $('#dpPush').on('changeDate', pushDataChecker);

            $('#dlgPush').modal({
                backdrop : false,
                keyboard : true
            });
        }
    });
};

function pushDataChecker(e) {
    taskDataChecker('Push');
};

function passDataChecker(e) {
    taskDataChecker('Pass');
};

function taskDataChecker(kind) {

    var due_date = $('#input' + kind + 'Duedate').val();
    var title = $('#input' + kind + 'Title').val();
    var desc = $('#ta' + kind + 'Desc').val();
    var members = new Array();

    $('#alertBox' + kind + 'Member').children().each(function() {
        members.push($(this).text());
    });

    var valid = (title !== "") && (desc !== "") && (due_date !== "") && (members.length !== 0);

    if ( valid ) {
        $("#btn" + kind).removeClass('disabled');
        $("#btn" + kind).attr('href', '#');
    } else {
        $("#btn" + kind).addClass('disabled');
        $("#btn" + kind).attr('href', '#');
    }
};

function openTaskDialog(kind, id) {


    $.get('/project/' + kind + '/' + id, function(data) {
        $.ajax({
            url: '/template/dlgTask',
            type: 'get',
            success: function(templates) {
                $.ajax({
                    url: '/project/' + kind + '/' + id,
                    type: 'get',
                    success : function(result) {
                        console.log(result);
                        $('body').append(templates);
                        $('#tmplDlgTaskBody').tmpl(result).appendTo('#dlgTask .modal-body');
                        $('#dpTask').datetimepicker({
                            pickTime: false
                        });

                        $('#taComment').on('focus', function() {
                            $(this).attr('rows', 6)
                        });

                        $('#taComment').on('blur', function() {
                            $(this).attr('rows', 1)
                        });

                        $('#btnSaveComment').on('click', function() {
                            $.ajax({
                                url: '/project/comment',
                                type: 'post',
                                data: { kind : 'push', time : '2013-11-04 02:06',
                                    name : 'Hoon', text : 'Hello! samelcd', id : '23'}
                            });
                        });

//                        {{tmpl(comments) "#tmplDlgTaskCommment"}}
                        $('.comment').flexText();

                        $('#dlgTask').modal({
                            backdrop: false,
                            keyboard: true
                        });
                    }
                });
            }
        });
    });
};

function openPassDialog(task_id) {
    $('#alertBoxPassMember').html('');

    $.ajax({
        url: '/template/dlgPass/' + task_id,
        type: 'get',
        success: function(templates) {
            $('body').append(templates);

            // default
            $('#btnToss').attr('class', 'btn btn-warning');
            $('#btnReturn').attr('class', 'btn btn-default');

            $('#btnToss').click(function() {
                $('#btnToss').attr('class', 'btn btn-warning');
                $('#btnReturn').attr('class', 'btn btn-default');
                $('#btnPass').removeClass('btn-danger');
                $('#btnPass').addClass('btn-warning');
                $('#btnPass').text('Toss');
            });

            $('#btnReturn').click(function() {
                $('#btnToss').attr('class', 'btn btn-default');
                $('#btnReturn').attr('class', 'btn btn-danger');
                $('#btnPass').removeClass('btn-warning');
                $('#btnPass').addClass('btn-danger');
                $('#btnPass').text('Return');
            });

            $('#dpPass').datetimepicker({
                pickTime: false
            });

            $('#inputPassMember').typeahead({
                remote: '/project/taskMemberTypeahead?user_id=%QUERY'
            });

            $('#btnPass').click(function() {
                var classes = $('#btnReturn').attr('class');
                var task_kind = (classes === 'btn btn-default') ? 'toss' : 'submit';

                var due_date = $('#inputPassDuedate').val();
                var title = $('#inputPassTitle').val();
                var desc = $('#taPassDesc').val();
                var members = new Array();

                $('#alertBoxPassMember').children().each(function() {
                    members.push($(this).text());
                });

                $.ajax({
                    url : '/project/' + task_kind + '/' + task_id,
                    type: 'post',
                    data: { due_date : due_date, title : title, desc : desc,
                        members : members },
                    success : function(result) {
                        if(result.status === "success") {
                            return true;
                        }

                        return false;
                    }
                });

            });

            $('#inputPassTitle, #taPassDesc').on('keyup', passDataChecker);
            $('#alertBoxPassMember').on('change', passDataChecker);
            $('#dpPass').on('changeDate', passDataChecker);

            $('#dlgPass').modal({
                backdrop: false,
                keyboard:true
            });
        }
    });
};


function addTaskMember(input, box) {
    var memberId = $('#' + input).val();
    var alertBox = $('#' + box);
    alertBox.append('<span class="label label-success margin-10">' + memberId + '</span>\n')
    alertBox.change();
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



