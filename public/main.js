var style = document.createElement('link');

style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', 'public/style.css');

var head = document.getElementsByTagName('head')[0];

head.appendChild(style);