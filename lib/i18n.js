(function(window) {
  var I18n, assert, findTemplate, get, set, isBinding, lookupKey, pluralForm,
      keyExists;

  get = Ember.Handlebars.get || Ember.Handlebars.getPath || Ember.getPath;
  set = Ember.set;

  function warn(msg) { Ember.Logger.warn(msg); }

  if (typeof CLDR !== "undefined" && CLDR !== null) pluralForm = CLDR.pluralForm;

  if (pluralForm == null) {
    warn("CLDR.pluralForm not found. Em.I18n will not support count-based inflection.");
  }

  lookupKey = function(key, hash) {
    var firstKey, idx, remainingKeys;

    if (hash[key] != null) { return hash[key]; }

    if ((idx = key.indexOf('.')) !== -1) {
      firstKey = key.substr(0, idx);
      remainingKeys = key.substr(idx + 1);
      hash = hash[firstKey];
      if (hash) {
        return lookupKey(remainingKeys, hash);
      }
    }
    return null;
  };

  assert = Ember.assert != null ? Ember.assert : window.ember_assert;

  findTemplate = function(key, setOnMissing) {
    assert("You must provide a translation key string, not %@".fmt(key), typeof key === 'string');
    var result = lookupKey(key, I18n.translations);

    if (setOnMissing) {
      if (result == null) {
        result = I18n.translations[key] = function() { return "Missing translation: " + key; };
        result._isMissing = true;
        warn("Missing translation: " + key);
        I18n[(typeof I18n.trigger === 'function' ? 'trigger' : 'fire')]('missing', key); //Support 0.9 style .fire
      }
    }

    if ((result != null) && !jQuery.isFunction(result)) {
      result = I18n.translations[key] = I18n.compile(result);
    }

    return result;
  };

  keyExists = function(key) {
    var translation = lookupKey(key, I18n.translations);
    return translation != null && !translation._isMissing;
  };

  function eachTranslatedAttribute(object, fn) {
    var isTranslatedAttribute = /(.+)Translation$/,
        isTranslatedAttributeMatch;

    for (var key in object) {
      isTranslatedAttributeMatch = key.match(isTranslatedAttribute);
      if (isTranslatedAttributeMatch) {
        fn.call(object, isTranslatedAttributeMatch[1], I18n.t(object[key]));
      }
    }
  }

  I18n = Ember.Evented.apply({
    compile: Handlebars.compile,

    translations: {},

    template: function(key, count) {
      var interpolatedKey, result, suffix;
      if ((count != null) && (pluralForm != null)) {
        suffix = pluralForm(count);
        interpolatedKey = [key, suffix].join('.');
        result = findTemplate(interpolatedKey, false);
      }
      return result != null ? result : findTemplate(key, true);
    },

    t: function(key, context) {
      var template;
      if (context == null) context = {};
      template = I18n.template(key, context.count);
      return template(context);
    },

    exists: keyExists,

    TranslateableProperties: Em.Mixin.create({
      init: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          this.addObserver(attribute + 'Translation', this, function(){
            set(this, attribute, I18n.t(this.get(attribute + 'Translation')));
          });
          set(this, attribute, translation);
        });

        return result;
      }
    }),

    TranslateableAttributes: Em.Mixin.create({
      didInsertElement: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          this.$().attr(attribute, translation);
        });
        return result;
      }
    })
  });

  Ember.I18n = I18n;

  isBinding = /(.+)Binding$/;

  Handlebars.registerBoundHelper('t', function(key, options) {
    var attrs, context, types, safe, result;

    context = this;
    types = options.hashTypes;
    attrs = {};

    Ember.keys(options.hash).map(function(originalKey) {
      var key = originalKey;
      isBindingMatch = key.match(isBinding);

      if (isBindingMatch) {
        key = isBindingMatch[1];
        types[key] = 'ID'
      }

      if (types[key] === 'ID') {
        value = get(context, key);
      } else {
        value = options.hash[key];
      }

      attrs[key] = value
    });
    safe = attrs.htmlSafe || false;

    result = I18n.t(key, attrs);
    if (!safe) {
      result = new Handlebars.SafeString(result)
    }

    return result;
  });

  var attrHelperFunction = function(options) {
    var attrs, result;
    attrs = options.hash;
    result = [];

    Ember.keys(attrs).forEach(function(property) {
      return result.push('%@="%@"'.fmt(property, I18n.t(attrs[property])));
    });

    return new Handlebars.SafeString(result.join(' '));
  };
    
  Handlebars.registerHelper('translateAttr', attrHelperFunction);
  Handlebars.registerHelper('ta', attrHelperFunction);

}).call(undefined, this);
