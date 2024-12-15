var x = document.getElementById('login');
var y = document.getElementById('register');
var z = document.getElementById('btn');

function login() {
  x.style.left = '27px';
  y.style.right = '-350px';
  z.style.left = '0px';
}
function register() {
  x.style.left = '-350px';
  y.style.right = '25px';
  z.style.left = '150px';
}

// View Password codes

function myLogPassword() {
  var a = document.getElementById('logPassword');
  var b = document.getElementById('eye');
  var c = document.getElementById('eye-slash');

  if (a.type === 'password') {
    a.type = 'text';
    b.style.opacity = '0';
    c.style.opacity = '1';
  } else {
    a.type = 'password';
    b.style.opacity = '1';
    c.style.opacity = '0';
  }
}

function myRegPassword() {
  var d = document.getElementById('password');
  var b = document.getElementById('eye-2');
  var c = document.getElementById('eye-slash-2');

  if (d.type === 'password') {
    d.type = 'text';
    b.style.opacity = '0';
    c.style.opacity = '1';
  } else {
    d.type = 'password';
    b.style.opacity = '1';
    c.style.opacity = '0';
  }
}

const avatar = document.getElementById('avatar');
const coverImage = document.getElementById('coverImage');

const labelAvatar = document.getElementById('labelAvatar');
const labelCoverImage = document.getElementById('labelCoverImage');

// Show the selected file name when the user chooses a file for avatar
avatar.addEventListener('change', function () {
  if (avatar.files.length > 0) {
    labelAvatar.textContent = avatar.files[0].name;
    labelAvatar.style.fontSize = '10px';
  } else {
    labelAvatar.textContent = 'Avatar';
    labelAvatar.style.fontSize = '10px';
  }
});

// Show the selected file name when the user chooses a file for coverImage
coverImage.addEventListener('change', function () {
  if (coverImage.files.length > 0) {
    labelCoverImage.textContent = coverImage.files[0].name;
    labelCoverImage.style.fontSize = '10px';
  } else {
    labelCoverImage.textContent = 'Banner';
    labelCoverImage.style.fontSize = '10px';
  }
});
