# nsrun

A utility that will run npm scripts without all the logs from `npm run-script`.


## USAGE

```
Install:
  npm install -g nsrun

Run a script defined in package.json:
  nsrun <script-name> <arguments-for-your-script>

List all the scripts defined in package.json:
  nsrun
```

## FEATURES

- Steps right into the background and allows your script to take over. The only
  output you see is whatever the script itself outputs.

- Just like `npm run-script`, augments your `$PATH` with the binaries in
  `./node_modules/.bin/`, so you can use `mocha` without worrying about
  installing it globally (for example).

- Passes arguments right through to your script (no need for `--`).

- TODO: Uses `nsrun` whenever it sees `npm run-script` or `npm run` in one of
  your script definitions.

## WHY?

I love [npm's `run-script` feature](https://docs.npmjs.com/cli/run-script). It
feels right to put all the "scripts" that go along with your code in one simple
place, right next to all the other metadata about your project, in
`package.json`. Your scripts are expressed as shell scripts, nice and easy.
(Want to learn more about why I prefer this over something like `grunt` or
`gulp` as a script runner? [Here is one justification that I agree
with.](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/))

There's a small problem with `npm run-script` though. When your script exits
with a nonzero exit code, indicating that there was an error, you see lines and
lines of copy written by `npm` basically saying "this error is probably because
the script is bad, not because npm messed up... but in case npm did mess up,
here's how you can most helpfully report a bug!"

Now, from npm's perspective this makes a lot of sense... I am sure they get a
lot of bug reports from clueless users, especially when `npm install x` goes
wrong or something. But in my use case, this output is often very frustrating.
You see, I like to use `npm run-script` to run my tests (usually with the
shorthand, `npm test`). If the test fails, the script will fail with a nonzero
exit code. And `npm` then outputs all the boilerplate that we've been
discussing.

But before all that boilerplate output is output from my script itself,
including information about which test failed and why. And that's the
information I really want to see.

I wrote this utility to replace `npm run-script` -- the only difference is that
this one doesn't print out any output at all. In fact, it uses `kexec` to just
*become* whatever process your script should be.

## TESTING

```
npm install
nsrun test
```
