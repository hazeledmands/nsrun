const nixt = require("nixt");

describe("At end arguments", function() {
  it("runs the scripts you define in package.json", function(done) {
    nixt()
      .run("./nsrun.js monkey-facts")
      .stdout("Monkeys are fun")
      .stderr("")
      .code(0)
      .end(done);
  });

  it("runs the scripts you define in package.json with arguments", function(done) {
    nixt()
      .run("./nsrun.js monkey-facts when asleep")
      .stdout("Monkeys are fun when asleep")
      .stderr("")
      .code(0)
      .end(done);
  });

  it("runs nested scripts with nsrun instead of npm run", function(done) {
    nixt()
      .run("./nsrun.js tell-me-about-monkeys")
      .stdout("Monkeys are fun\nMonkeys are frequently cheeky")
      .stderr("")
      .code(0)
      .end(done);
  });

  it("exits with the same code as the script", function(done) {
    nixt()
      .run("./nsrun.js fail")
      .stdout("")
      .stderr("")
      .code(1)
      .end(done);
  });

  it("outputs all the scripts in package.json with no arguments", function(done) {
    nixt()
      .run("./nsrun.js")
      .stdout(
        [
          "10 scripts in ./package.json:",
          " * test",
          " * monkey-facts",
          " * more-monkey-facts",
          " * tell-me-about-monkeys",
          " * give-a-monkey-name",
          " * monkeys-dreams",
          " * more-monkeys-dreams",
          " * monkeys-knows-nothing",
          " * fail",
          " * precommit"
        ].join("\n")
      )
      .stderr("")
      .code(0)
      .end(done);
  });
});

describe("Positionned arguments", function() {
  it("runs the scripts you define in package.json with $1 argument", function(done) {
    nixt()
      .run("./nsrun.js give-a-monkey-name monkymonk")
      .stdout("My monkey as that stupid name : monkymonk")
      .stderr("")
      .code(0)
      .end(done);
  });

  it("runs the scripts you define in package.json with $* arguments", function(done) {
    nixt()
      .run("./nsrun.js monkeys-dreams flowers trees grasses and no ice creams")
      .stdout(
        "Monkeys dreams of flowers trees grasses and no ice creams, sometimes"
      )
      .stderr("")
      .code(0)
      .end(done);
  });

  it("runs the scripts you define in package.json with few arguments", function(done) {
    nixt()
      .run(
        "./nsrun.js more-monkeys-dreams flowers trees sleeps for an ice creams"
      )
      .stdout(
        "Monkeys dreams 2 things : trees and flowers, sometimes it sleeps for an ice creams"
      )
      .stderr("")
      .code(0)
      .end(done);
  });

  it("runs the scripts you define in package.json with bad arguments", function(done) {
    nixt()
      .run("./nsrun.js monkeys-knows-nothing just like john snow")
      .stdout("Arguments in script missmatchs")
      .stderr("")
      .code(1)
      .end(done);
  });
});
