/**
 * @author Jasl
 * @version 0.1
 *
 */
var Validator = (function() {
  var self = {};

  var _val_rules = [];

  /**
   * Validate a value by rules
   * @param {String} item the value which will be validated
   * @param {Object} pattern validate's strategy
   * @return (Array) rules which doesn't passed
   */
  self.validate = function(value, pattern) {
    var errors = [];

    for (var i in pattern.validates) {
      var rule = _val_rules[pattern.validates[i]];
      if (rule.preprocessing) {
        rule.preprocessing(pattern);
      }

      if (!rule.shoulda(value, pattern)) {
        errors.push(pattern.validates[i]);
      }
    }

    return errors;
  };

  /**
   * Add rule to validator.
   * @param {String} name rule's name
   * @param {Object} rule rule strategy
   */
  self.add_rule = function(name, rule) {
    _val_rules[name] = rule;
  };

  return self;
})();

Validator.add_rule('presence', {
  shoulda : function(value, pattern) {
    return value !== '';
  }
});

Validator.add_rule('size', {
  preprocessing : function(pattern) {
    if (!pattern.size.minimium) {
      pattern.size.minimium = 0;
    }
    if (!pattern.size.maximium) {
      pattern.size.maximium = 50;
    }
  },
  shoulda : function(value, pattern) {
    return value.length >= pattern.size.minimium && value.length <= pattern.size.maximium;
  }
});

Validator.add_rule('format', {
  shoulda : function(value, pattern) {
    if (!pattern.format) {
      return false;
    }
    return pattern.format.test(value);
  }
});

Validator.add_rule('shoulda', {
  shoulda : function(value, pattern) {
    if (!pattern.shoulda) {
      return false;
    }
    return pattern.shoulda(value);
  }
});

Validator.add_rule('inclusion', {
  shoulda : function(value, pattern) {
    if (!pattern.inclusion) {
      return false;
    }

    var flag = false;
    if (value === "") {
      return true;
    }
    for (var i in pattern.inclusion) {
      if (pattern.inclusion[i] === value) {
        flag = true;
        break;
      }
    }
    return flag;
  }
});

Validator.add_rule('exclusion', {
  shoulda : function(value, pattern) {
    if (!pattern.exclusion) {
      return false;
    }

    var flag = true;
    for (var i in pattern.exclusion) {
      if (pattern.exclusion[i] === value) {
        flag = false;
        break;
      }
    }
    return flag;
  }
});

Validator.add_rule('email', {
  shoulda : function(value, pattern) {
    if (value === "") {
      return true;
    }
    var regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return regex.test(value);
  },
});
