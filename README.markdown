#validator.js

A researching library to validate values, will support both browser-side and node.js.

Idea
-----
Inspired by Rails active model's validator, Validator.js supply many kind of rules,
such as presence, size, regex, etc... and the value will be validated by given pattern.

Design
-----
Validator core is pure, just supply manage rule and check value by given pattern.

To adapt to browser and nodejs, Validator.js has a wrapper to enhence the core,
and supply some helpful methods.

License
-----
*Copyright jasl, MIT licence.*