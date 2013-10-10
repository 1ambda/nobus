

module.exports.listen = function(io) {

    var comment = io.of('/comment').on('connection', function(socket) {

    });

    return comment;

};