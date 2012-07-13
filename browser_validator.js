Validator.message_templates = {
  presence : "{display}不能为空。",
  size : "{display}的长度应在{size.minimium}-{size.maximium}之间。",
  format : "{display}格式无效。",
  shoulda : "{display}格式无效。",
  inclusion : "{display}的值应是[{inclusion}]之一。",
  exclusion : "{display}不能包含[{exclusion}]。",
  email : "{display}不是有效的E-mail格式。"
};

Validator.generate_message = function(message, item) {
  var msg = message;
  var variables = msg.match(/\{[.\w]+\}/ig);

  if (msg.indexOf('{display}') >= 0) {
    if (item.display) {
      msg = msg.replace('{display}', item.display);
    } else {
      msg = msg.replace('{display}', "");
    }
  }

  for (var i in variables) {
    var key = variables[i].match(/\w+/ig);
    var value = item.pattern[key[0]];
    if (key.length > 1) {
      for (var v = 1; v < key.length; v++) {
        value = value[key[v]];
      }
    }
    if ( typeof (value) === 'object') {
      value = value.toString();
    }
    msg = msg.replace(variables[i], value);
  }
  msg = msg.replace(/\{[.\w]+\}/ig, '');
  return msg;
};

Validator.val_items = [];

Validator.default_message = "{display} is invalid.";
Validator.default_callback = undefined;
Validator.submit_callback = undefined;

Validator.ensure = function(item, pattern) {
  var val_item = item;
  val_item.pattern = pattern;
  if (item.callback === undefined && Validator.default_callback) {
    val_item.callback = Validator.default_callback
  }
  if ( typeof (item.source) === 'string') {
    val_item.identity = item.source;
  }
  if (item.identity) {
    Validator.val_items[item.identity] = val_item;
  } else {
    Validator.val_items.push(val_item);
  }
};

Validator.check = function(identity, use_callback) {
  if (Validator.val_items[identity] === undefined) {
    return undefined;
  }
  var item = Validator.val_items[identity];
  if(item.condition && !item.condition()) {
    return true;
  }
  var value = null;
  if ( typeof (item.source) === "function") {
    value = item.source();
  } else {
    value = document.getElementById(item.source).value;
  }
  var errors = Validator.validate(value, item.pattern);
  var is_correct = (errors.length == 0);
  item.error_messages = [];
  for (var i in errors) {
    item.error_messages.push(Validator.generate_message(Validator.message_templates[errors[i]], item));
  }
  if (use_callback && Validator.val_items[identity].callback) {
    item.callback(Validator.val_items[identity], is_correct);
  }
  return is_correct;
};

Validator.check_all = function(use_callback) {
  var flag = true;
  var error_items = [];
  for (var i in Validator.val_items) {
    var result = Validator.check(i, false);
    flag = result && flag;
    if(!result) {
      error_items.push(Validator.val_items[i]);
    }
  }
  if(use_callback && Validator.submit_callback) {
    Validator.submit_callback(error_items);
  }
  return flag;
};
