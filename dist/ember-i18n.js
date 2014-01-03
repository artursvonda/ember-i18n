(function() {
(function(globals) {

  // CLDR Pluralization Data
  // see http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html

  // The six plural forms. Not all languages use all six forms.
  var Zero = 'zero',
      One = 'one',
      Two = 'two',
      Few = 'few',
      Many = 'many',
      Other = 'other',
      Data = {};

  function isInt(value) {
    return value << 0 === value;
  }

  function isAmong(value, array) {
    for ( var i = 0; i < array.length; ++i ) {
      if (array[i] === value) { return true; }
    }
    return false;
  }

  function defineLanguageRule(languages, rule) {
    for ( var i = 0; i < languages.length; ++i ) {
      Data[ languages[i] ] = rule;
    }
  }

  defineLanguageRule([
    'az', 'bm', 'my', 'zh', 'dz', 'ka', 'hu', 'ig', 'id', 'ja', 'jv', 'kea',
    'kn', 'km', 'ko', 'ses', 'lo', 'kde', 'ms', 'fa', 'root', 'sah', 'sg',
    'ii', 'th', 'bo', 'to', 'tr', 'vi', 'wo', 'yo'
  ], function() {
    return Other;
  });

  defineLanguageRule([ 'gv' ], function(n) {
    if ( isAmong(n % 10, [ 1, 2 ]) || n % 20 === 0 ) { return One; }
    return Other;
  });

  defineLanguageRule([ 'tzm' ], function(n) {
    if ( n === 0 || n === 1 ) { return One; }
    if ( isInt(n) && n >= 11 && n <= 99 ) { return One; }
    return Other;
  });

  defineLanguageRule([ 'mk' ], function(n) {
    return n % 10 === 1 && n !== 11 ? One : Other;
  });

  defineLanguageRule([ 'fr', 'ff', 'kab' ], function(n) {
    return n >= 0 && n < 2 ? One : Other;
  });

  defineLanguageRule([
    'ak', 'am', 'bh', 'fil', 'guw', 'hi', 'ln', 'mg', 'nso', 'tl', 'ti', 'wa'
  ], function(n) {
    return n === 0 || n === 1 ? One : Other;
  });

  defineLanguageRule([
    'af', 'sq', 'eu', 'bem', 'bn', 'brx', 'bg', 'ca', 'chr', 'cgg', 'da', 'dv',
    'nl', 'en', 'eo', 'et', 'ee', 'fo', 'fi', 'fur', 'gl', 'lg', 'de', 'el',
    'gu', 'ha', 'haw', 'he', 'is', 'it', 'kl', 'kk', 'ku', 'lb', 'ml', 'mr',
    'mas', 'mn', 'nah', 'ne', 'no', 'nb', 'nn', 'nyn', 'or', 'om', 'pap', 'ps',
    'pt', 'pa', 'rm', 'ssy', 'saq', 'xog', 'so', 'es', 'sw', 'sv', 'gsw',
    'syr', 'ta', 'te', 'tk', 'ur', 'wae', 'fy', 'zu'
  ], function(n) {
    return n === 1 ? One : Other;
  });

  defineLanguageRule([ 'lv' ], function(n) {
    if (n === 0) { return Zero; }
    if (n % 10 === 1 && n % 100 !== 11) { return One; }
    return Other;
  });

  defineLanguageRule([ 'ksh' ], function(n) {
    if (n === 0) { return Zero; }
    if (n === 1) { return One; }
    return Other;
  });

  defineLanguageRule([ 'lag' ], function(n) {
    if (n === 0) { return Zero; }
    if (n > 0 && n < 2) { return One; }
    return Other;
  });

  defineLanguageRule([
    'kw', 'smn', 'iu', 'ga', 'smj', 'se', 'smi', 'sms', 'sma'
  ], function(n) {
    if (n === 1) { return One; }
    if (n === 2) { return Two; }
    return Other;
  });

  defineLanguageRule([
    'be', 'bs', 'hr', 'ru', 'sr', 'sh', 'uk'
  ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( mod10 === 1 && n % 100 !== 11 ) { return One; }

    if ( isAmong(mod10, [ 2, 3, 4 ]) &&
         !isAmong(mod100, [ 12, 13, 14 ]) ) { return Few; }

    if ( isAmong(mod10, [ 0, 5, 6, 7, 8, 9 ]) ||
         isAmong(mod100, [ 11, 12, 13, 14 ]) ) { return Many; }

    return Other;
  });

  defineLanguageRule([ 'pl' ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( n === 1 ) { return One; }

    if ( isAmong(mod10, [ 2, 3, 4 ]) &&
         !isAmong(mod100, [ 12, 13, 14 ]) ) { return Few; }

    if ( isAmong(mod10, [ 0, 1, 5, 6, 7, 8, 9 ]) ||
         isAmong(mod100, [ 12, 13, 14 ]) ) { return Many; }

    return Other;
  });

  defineLanguageRule([ 'lt' ], function(n) {
    var mod10  = n % 10,
        mod100 = n % 100;

    if ( mod10 === 1 && mod100 !== 11 ) { return One; }

    if ( isInt(n) &&
         mod10 >= 2 && mod10 <= 9 &&
         mod100 >= 12 && mod100 <= 19 ) { return Few; }

    return Other;
  });

  defineLanguageRule([ 'shi' ], function(n) {
    if ( n >= 0 && n <= 1 ) { return One; }
    if ( isInt(n) && n >= 2 && n <= 9 ) { return Few; }
    return Other;
  });

  defineLanguageRule([ 'mo', 'ro' ], function(n) {
    var mod100 = n % 100;

    if ( n === 1 ) { return One; }

    if ( n === 0 ||
         (isInt(n) && mod100 >= 1 && mod100 <= 19) ) { return Few; }

    return Other;
  });

  defineLanguageRule([ 'cs', 'sk' ], function(n) {
    if ( n === 1 ) { return One; }
    if ( isAmong(n, [ 2, 3, 4 ]) ) { return Few; }
    return Other;
  });

  defineLanguageRule([ 'sl' ], function(n) {
    var mod100 = n % 100;
    if ( mod100 === 1 ) { return One; }
    if ( mod100 === 2 ) { return Two; }
    if ( mod100 === 3 || mod100 === 4 ) { return Few; }
    return Other;
  });

  defineLanguageRule([ 'mt' ], function(n) {
    if ( n === 1 ) { return One; }
    var mod100 = n % 100;
    if ( isInt(mod100) && mod100 >= 2 && mod100 <= 10 ) { return Few; }
    if ( isInt(mod100) && mod100 >= 11 && mod100 <= 19 ) { return Many; }
    return Other;
  });

  defineLanguageRule([ 'ar' ], function(n) {
    if ( n === 0 ) { return Zero; }
    if ( n === 1 ) { return One; }
    if ( n === 2 ) { return Two; }
    var mod100 = n % 100;
    if ( isInt(mod100) && mod100 >= 3 && mod100 <= 10 ) { return Few; }
    if ( isInt(mod100) && mod100 >= 11 && mod100 <= 99 ) { return Many; }
    return Other;
  });

  defineLanguageRule([ 'br', 'cy' ], function(n) {
    switch ( n ) {
      case 0: return Zero;
      case 1: return One;
      case 2: return Two;
      case 3: return Few;
      case 6: return Many;
      default: return Other;
    }
  });

  if ( globals.CLDR == null ) { globals.CLDR = {}; }

  var CLDR = globals.CLDR;

  // Look up the proper plural key for a count and language.
  // If CLDR.defaultLanguage is set, language is optional.
  //
  // For example:
  //
  //     CLDR.pluralForm(0, 'en');     // => 'other'
  //     CLDR.pluralForm(1, 'en-US');  // => 'one'
  //     CLDR.pluralForm(2.383, 'fr'); // => 'other'
  //     CLDR.pluralForm(1, 'zh');     // => 'other'
  //     CLDR.pluralForm(26, 'uk');    // => 'many'
  //
  // @return [String] the proper key (one of `CLDR.pluralForm.Zero`,
  //   `.One`, `.Two`, `.Few`, `.Many`, or `.Other`).
  CLDR.pluralForm = function(count, language) {
    if (count == null) { throw new Error("CLDR.pluralForm requires a count"); }
    language = language || CLDR.defaultLanguage;
    if (language == null) { throw new Error("CLDR.pluralForm requires a language"); }
    language = language.replace(/^(\w\w\w?)-?.*/, "$1");
    if (Data[language] == null) { throw new Error("No CLDR pluralization information for " + language); }
    return Data[language].call(CLDR, +count);
  };

  CLDR.pluralForm.Zero  = Zero;
  CLDR.pluralForm.One   = One;
  CLDR.pluralForm.Two   = Two;
  CLDR.pluralForm.Few   = Few;
  CLDR.pluralForm.Many  = Many;
  CLDR.pluralForm.Other = Other;

}(this));
(function() {
  var I18n, assert, findTemplate, get, set, isBinding, lookupKey, pluralForm,
      keyExists;

  get = Ember.Handlebars.get;
  set = Ember.set;
  assert = Ember.assert;
  pluralForm = CLDR.pluralForm;

  function warn(msg) { Ember.Logger.warn(msg); }

  lookupKey = function(key, hash) {
    var firstKey, idx, remainingKeys;

    if (hash[key] != null) { return hash[key]; }

    if ((idx = key.indexOf('.')) !== -1) {
      firstKey = key.substr(0, idx);
      remainingKeys = key.substr(idx + 1);
      hash = hash[firstKey];
      if (hash) { return lookupKey(remainingKeys, hash); }
    }
  };

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
        interpolatedKey = "%@.%@".fmt(key, suffix);
        result = findTemplate(interpolatedKey, false);
      }
      return result != null ? result : result = findTemplate(key, true);
    },

    t: function(key, context) {
      var template;
      if (context == null) context = {};
      template = I18n.template(key, context.count);
      return template(context);
    },

    exists: keyExists,

    TranslatableProperties: Ember.Mixin.create({
      init: function() {
        var result = this._super.apply(this, arguments);
        eachTranslatedAttribute(this, function(attribute, translation) {
          set(this, attribute, translation);
        });
        return result;
      }
    }),

    TranslatableAttributes: Ember.Mixin.create({
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

  Handlebars.registerHelper('t', function(key, options) {
    var context, types, attrs, result, isBindingMatch, value;
    context = this;
    types = options.hashTypes;
    attrs = {};

    Ember.keys(options.hash).map(function(originalKey) {
      var key = originalKey;
      isBindingMatch = key.match(isBinding);

      if (isBindingMatch) {
        key = isBindingMatch[1];
        types[key] = 'ID';
      }

      if (types[key] === 'ID') {
        value = get(context, key);
      } else {
        value = options.hash[key];
      }

      attrs[key] = value;
    });

    result = I18n.t(key, attrs);

    if (!attrs.htmlSafe || false) {
      result = new Handlebars.SafeString(result);
    }

    return result;
  });

  Handlebars.registerHelper('translateAttr', function(options) {
    var attrs, result;
    attrs = options.hash;
    result = [];

    Ember.keys(attrs).forEach(function(property) {
      var translatedValue;
      translatedValue = I18n.t(attrs[property]);
      return result.push('%@="%@"'.fmt(property, translatedValue));
    });

    return new Handlebars.SafeString(result.join(' '));
  });

}).call(undefined);
}());
