module.exports = {
    isOwner:function(request, response) {
        // request.user로 로그인 성공 여부를 확인할 수 있다.
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>'
        if (this.isOwner(request, response)) {
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
}