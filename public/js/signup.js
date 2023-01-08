$(function () {
  const overlay = $('.overlay');

  $('#create-account').on('click', function (e) {
    e.preventDefault();
    const firstName = $('input[name="firstName"]').val();
    const lastName = $('input[name="lastName"]').val();
    const dateOfBirth = $('input[name="dateOfBirth"]').val();
    const address = $('input[name="address"]').val();
    const email = $('input[name="email"]').val();
    const password = $('input[name="password"]').val();

    if (
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !address ||
      !email ||
      !password
    )
      return;

    overlay.toggleClass('hide');
    $.ajax({
      url: `/auth/signup`,
      type: 'POST',
      dataType: 'json',
      data: {
        firstName,
        lastName,
        dateOfBirth,
        address,
        email,
        password,
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
