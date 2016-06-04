const nixt = require('nixt');

it('runs the scripts you define in package.json', function (done) {
  nixt()
  .run('./nsrun.js tell-me-about-monkeys')
  .stdout('Monkeys are fun')
  .stderr('')
  .code(0)
  .end(done);
});

it('runs nested scripts with nsrun instead of npm run', function (done) {
  nixt()
  .run('./nsrun.js tell-me-more-about-monkeys')
  .stdout('Monkeys are fun\nBut they can be a lot of work too.')
  .stderr('')
  .code(0)
  .end(done);
});

it('exits with the same code as the script', function (done) {
  nixt()
  .run('./nsrun.js fail')
  .stdout('')
  .stderr('')
  .code(1)
  .end(done);
});

it('outputs all the scripts in package.json with no arguments', function (done) {
  nixt()
  .run('./nsrun.js')
  .stdout([
    '4 scripts in ./package.json:',
    ' * test',
    ' * tell-me-about-monkeys',
    ' * tell-me-more-about-monkeys',
    ' * fail'
  ].join('\n'))
  .stderr('')
  .code(0)
  .end(done);
});
