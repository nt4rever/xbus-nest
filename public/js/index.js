$(function () {
  let token = getUrlVars()['token'];
  const overlay = $('.overlay');
  if (token) {
    $.ajax({
      url: 'user',
      type: 'GET',
      dataType: 'json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      },
      success: function (data) {
        overlay.addClass('hide');
        $('input[name="email"]').val(data.email);
        $('input[name="firstName"]').val(data.firstName);
        $('input[name="lastName"]').val(data.lastName);
        $('input[name="dateOfBirth"]').val(data.dateOfBirth);
        $('input[name="address"]').val(data.address);
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
    const firstName = $('input[name="firstName"]').val();
    const lastName = $('input[name="lastName"]').val();
    const dateOfBirth = $('input[name="dateOfBirth"]').val();
    const address = $('input[name="address"]').val();

    if (!firstName || !lastName || !dateOfBirth || !address) return;
    overlay.toggleClass('hide');

    $.ajax({
      url: '/user',
      type: 'PATCH',
      dataType: 'json',
      data: {
        firstName,
        lastName,
        dateOfBirth,
        address,
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
        console.log(err);
      },
    });
  });

  $('.button-change-password').on('click', function (e) {
    e.preventDefault();
    window.location.href = `/page/password?token=${token}`;
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
