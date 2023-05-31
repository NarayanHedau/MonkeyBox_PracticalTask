const { google } = require('googleapis');

module.exports =  new google.auth.OAuth2(
    '742351743351-mhc571pte77akg65a7t0lgra8v2juoj0.apps.googleusercontent.com',
    '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',
    'http://localhost:3000/callback/'
  );