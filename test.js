const test = require('tape');
const crawler = require('./crawler');

const user = 'sepiropht';
const pass = 'azerty';
const courses = 'javascript-basics';

test('test scraper', function(t) {
  crawler({ user, pass, courses }).then(res => {
    t.equal(res.length, 19);
    t.equal(res[0].fileName, '1-introduction.webm');
    t.equal(res[18].fileName, '19-ecmascript-6.webm');
    t.end();
  });
});
test.onFinish(() => process.exit(0));
