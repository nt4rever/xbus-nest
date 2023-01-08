$(function () {
  let token = getUrlVars()['token'];
  const overlay = $('.overlay');
  if (token) {
    $.ajax({
      url: '/user',
      type: 'GET',
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      },
      success: function () {
        overlay.addClass('hide');
      },
      error: function (err) {
        $('.wrapper__container').html('Error');
        overlay.addClass('hide');
        console.log(err);
      },
    });
  }

  $('#change-info').on('click', function (e) {
    e.preventDefault();
    const oldPassword = $('input[name="oldPassword"]').val();
    const newPassword = $('input[name="newPassword"]').val();

    if (!oldPassword || !newPassword) return;
    overlay.toggleClass('hide');

    $.ajax({
      url: '/user/password',
      type: 'POST',
      dataType: 'json',
      data: {
        oldPassword,
        newPassword,
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      },
      success: function () {
        $('.wrapper__container').html('Success');
        overlay.toggleClass('hide');
      },
      error: function (err) {
        overlay.toggleClass('hide');
        $('.wrapper__container').html('Error');
        console.log(err);
      },
    });
  });
});

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf('?') + 1)
    .split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
