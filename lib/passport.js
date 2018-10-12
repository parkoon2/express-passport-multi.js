var db = require('../lib/db')
module.exports = function (app) {

    var authData = {
        email: 'parkoon',
        password: '1234',
        nickname: 'parkoon'
    };

    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;
    
    

    // passport를 express에 설치했어요
    app.use(passport.initialize()); // use --> express 에 middle ware를 설치한다. (express가 실행될 때마다)
    // passport session을 사용할 것이라 했어요.
    app.use(passport.session());

    // 로그인에 성공했을 때 딲! 한 번 실행된다.
    // 로그인시 done으로 전달한 파라미터를 받는다 (user)
    // session store에 저장한다 "passport":{"user":"parkoon"}}
    // 한번 호출 되고, 각각 페이지 방문할 때 마다 deserializerUser가 호출된다. 
    // 저장된 데이터를 기준으로 해서 그 사람이 맞는지 아닌지 체크한다
    passport.serializeUser(function (user, done) {
        // 두 번째 인자로 id(식별자)를 전달하시오.
        console.log('serializeUser', user)

        done(null, user.id);
    });
    // 페이지에 방문할 때 마다 호출된다
    // 그 사람이 맞는지 아닌지 확인하려고 하는거야!
    passport.deserializeUser(function (id, done) {
        let user = db.get('users').find({
            id
        }).value()
        console.log('deserializeUser', user)
        // 실제로는 id 값으로 데이터베이스를 조회해서 데이터를 가져온다.
        // 암기보다 중요한게 이해하는거, 이해보단 중요한게 익수해지는거
        // request 의 user 객체에서 해당 값 (authData)를 사용할 수 있다. 약속
        done(null, authData);
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'pwd'
    },
    // 사용자가 form을 이용해 데이터를 전송할 때마다 두 번째 callback 함수가 호출돼요
        function (email, password, done) {
            // done 호출에 따라서 성공/실패를 passport에 알려줄 수 있다.
            // 원래는 DB를 뒤지겠죠?
            console.log('LocalStrategy', email, password)

            let user = db.get('users').find({
                email,
                password
            }).value()

            if (user) {
                console.log('로그인성공')
                return done(null, user, {
                    message: 'Welcome.'
                });
            } else {
                console.log('로그인실패')
                return done(null, false, {
                    message: 'Incorrect user info.'
                });
            }
         
        }
    ));
    return passport;
}