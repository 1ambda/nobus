
exports.dlgMemberList = function(req, res) {
	res.render('template/dlgMemberList.html');
};

exports.dialogTask = function(req, res) {
	res.render('template/dlgTask.html');
};

exports.dlgRegister = function(req, res) {
    res.render('template/dlgRegister.html');
};

exports.dlgDrop = function(req, res) {
	res.render('template/dlgDrop.html');
};

exports.dlgInvite = function(req, res) {
	res.render('template/dlgInvite.html');
};

exports.dlgPush = function(req, res) {
    res.render('template/dlgPush.html');
};

exports.dlgTask = function(req, res) {
    res.render('template/dlgTask.html', { task_id : task_id });
};

exports.dlgPass = function(req, res) {
    var task_id = req.params.task_id;
    res.render('template/dlgPass.html', { task_id : task_id });
};

