var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');


var db = require('../lib/db')

const shortid = require('shortid')

db.defaults({
  users: []
}).write()

module.exports = function (passport) {
  router.get('/login', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
    `, '');
    response.send(html);
  });

  // passport로 로그인을 처리하겠습니다.
  // 방식은 local이에요. twitter facebook 다양해요.
  // 실패하면..? 성공하면..? 경로도 설정해줬어요.
  // local 전략은 어떻게 사용하냐면요...passport.use(new LocalStrategy({ .. 이렇게 사용해요
  router.post('/login_process',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true,
      successFlash: true
    }));


  router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
          <p><input type="text" name="email" placeholder="email" value="abc"></p>
          <p><input type="password" name="pwd" placeholder="password" value="1111"></p>
          <p><input type="password" name="pwd2" placeholder="password" value="1111"></p>
          <p><input type="text" name="displayName" placeholer="password" value="abc"></p>
          <p>
            <input type="submit" value="register">
          </p>
        </form>
      `, '');
    response.send(html);
  });

  router.post('/register_process', function (request, response) {
    var post = request.body;
    var email = post.email;
    var password = post.pwd;
    var password2 = post.pwd2;
    var displayName = post.displayName;
    var id = shortid.generate() 
    if (password !== password2) {
      request.flash('error', 'Password must same!');
      response.redirect('/auth/register')
    } else {
      let user = {
        id,
        email,
        password,
        displayName
      }
      db.get('users').push(user).write()

      request.login(user, function(err) {
        return response.redirect('/') 
      })
    }

  });

  router.get('/logout', function (request, response) {
    request.logout();
    // request.session.destroy(function() {

    // })
    request.session.save(function () {
      response.redirect('/');
    });
  });

  return router;
}