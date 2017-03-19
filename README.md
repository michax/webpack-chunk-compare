# Whoami

Commandline util for comparing chunk modules between two webpack stat json files. 
Basic Usage: 
```
wcmp a.json b.json
```

# Can I come over?

Installation is pretty easy:
```
npm install -g webpack-chunk-compare
```

# Use me!

```
wcmp path/to/a/a.json path/to/a/b.json
```

# What you get

```
--------------------
--  Contacts
--------------------

What "b" have that "a" doesn't
--------------
[ './special-lib.js' ]

What "a" have that "b" doesn't.
--------------
[]

--------------------
--  Common
--------------------

What "b" have that "a" doesn't
--------------
[]
What "a" have that "b" doesn't.
--------------
[ './lodash.js' ]
```

# Use cases

* Detecting why our chunk sizes changed in regards to previous project version.
* Reviewing new modules.

# Requirements

Util requires two webpack json stat files. [More info on how to generate them](https://webpack.js.org/configuration/stats/).

Make sure that at least below options are set to true:
```
{
  // Add chunk information (setting this to `false` allows for a less verbose output)
  chunks: true,
  // Add built modules information to chunk information
  chunkModules: true,
  // Add built modules information
  modules: true,
  children: true
}
```

Optionaly for more information use:

```
{
  // Add the origins of chunks and chunk merging info
  chunkOrigins: true,
}
```

# Additional arguments

* **--chunk-name:** Print only information about this specific chunk name
* **--a-name:** Set name to be used for 'a' changes.
* **--a-name:** Set name to be used for 'b' changes.
* **--verbose:** Print more details (including module details)
* **--child-index:** Show only child with given index. By default all children are processed.
* **--lose-matching:** Looselly match children, instead of exact entrypoints matching. Usefull when we know that children project chunk definition changed. By default exact entrypoints matching is used.