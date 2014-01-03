(function () {

  describe('Ember.I18n', function () {
    var view;

    function render(template, options) {
      if (options == null) options = {};
      options.template = Ember.Handlebars.compile(template);
      view = Ember.View.create(options);
      Ember.run(function() {
        view.append();
      });
    }

    beforeEach(function() {
      this.originalTranslations = Ember.I18n.translations;

      Ember.I18n.translations = {
        'foo.bar': 'A Foobar',
        'foo.bar.named': 'A Foobar named {{name}}',
        'foo.save.disabled': 'Saving Foo...',
        'foos.zero': 'No Foos',
        'foos.one': 'One Foo',
        'foos.other': 'All {{count}} Foos',
        'bars.all': 'All {{count}} Bars',
        baz: {
          qux: 'A qux appears'
        },
        fum: {
          one: 'A fum',
          other: '{{count}} fums'
        }
      };

      CLDR.defaultLanguage = 'ksh';
    });

    afterEach(function() {
      if (view != null) view.destroy();
      Ember.I18n.translations = this.originalTranslations;
      CLDR.defaultLanguage = null;
    });

    it('exists', function() {
      expect(Ember.I18n).to.not.equal(undefined);
    });

    describe('.exists', function() {
      it('returns true for present keys', function() {
        expect(Ember.I18n.exists('foo.bar')).to.equal(true);
      });

      it('returns false for absent keys', function() {
        expect(Ember.I18n.exists('chumble.fuzz')).to.equal(false);
      });

      it("returns false for absent keys even if they've been used", function() {
        Ember.I18n.t('yakka foob');
        expect(Ember.I18n.exists('yakka foob')).to.equal(false);
      });
    });

    describe('.t', function() {
      it('translates simple strings', function() {
        expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
      });

      it('interpolates', function() {
        expect(Ember.I18n.t('foo.bar.named', {
          name: 'Sue'
        })).to.equal('A Foobar named Sue');
      });

      it('uses the "zero" form when the language calls for it', function() {
        expect(Ember.I18n.t('foos', {
          count: 0
        })).to.equal('No Foos');
      });

      it('uses the "one" form when the language calls for it', function() {
        expect(Ember.I18n.t('foos', {
          count: 1
        })).to.equal('One Foo');
      });

      it('interpolates count', function() {
        expect(Ember.I18n.t('foos', {
          count: 21
        })).to.equal('All 21 Foos');
      });

      it("works on keys that don't have count suffixes", function() {
        expect(Ember.I18n.t('bars.all', {
          count: 532
        })).to.equal('All 532 Bars');
      });

      it('warns about missing translations', function() {
        expect(Ember.I18n.t('nothing.here')).to.equal('Missing translation: nothing.here');
      });

      describe('missing event', function() {
        var observer;

        afterEach(function() {
            Ember.I18n.off('missing', observer);
        });

        it('triggers missing events when translations are missing', function() {
          var didCall = false;
          observer = function(key) {
            expect(key).to.equal('nothing.here');
            didCall = true;
          };
          Ember.I18n.on('missing', observer);
          Ember.I18n.t('nothing.here');
          expect(didCall).to.equal(true);
        });
      });

      describe('using nested objects', function() {
        it('works with a simple case', function() {
          expect(Ember.I18n.t('baz.qux')).to.equal('A qux appears');
        });

        it('works with counts', function() {
          expect(Ember.I18n.t('fum', {
            count: 1
          })).to.equal('A fum');

          expect(Ember.I18n.t('fum', {
            count: 2
          })).to.equal('2 fums');
        });
      });

      it('prefers dotted keys to nested ones', function() {
        Ember.I18n.translations.foo = { bar: 'Nested foo.bar' };
        expect(Ember.I18n.t('foo.bar')).to.equal('A Foobar');
      });
    });

    describe('{{t}}', function() {
      it('outputs simple translated strings', function() {
        render('{{t "foo.bar"}}');

        Ember.run(function() {
          expect(view.$().text()).to.equal('A Foobar');
        });
      });

      it('interpolates values', function() {
        render('{{t "bars.all" count="597"}}');

        Ember.run(function() {
          expect(view.$().text()).to.equal('All 597 Bars');
        });
      });

      it('interpolates bindings', function() {
        render('{{t "bars.all" countBinding="count"}}', { context: { count: 3 } });

        Ember.run(function() {
          expect(view.$().text()).to.equal('All 3 Bars');
        });
      });

      it('responds to updates on bound properties', function() {
        render('{{t "bars.all" countBinding="count"}}', { context: { count: 3 } });

        Ember.run(function() {
          view.set('count', 4);
        });

        Ember.run(function() {
          expect(view.$().text()).to.equal('All 4 Bars');
        });
      });

      it('does not error due to bound properties during a rerender', function() {
        render('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

        expect(function() {
          Ember.run(function() {
            view.rerender();
            view.set('count', 4);
          });
        }).to.not['throw']();
      });

      it('responds to updates on bound properties after a rerender', function() {
        render('{{t "bars.all" countBinding="view.count"}}', { count: 3 });

        Ember.run(function() {
          view.rerender();
          view.set('count', 4);
        });

        Ember.run(function() {
          expect(view.$().text()).to.equal('All 4 Bars');
        });
      });

      it('obeys a custom tag name', function() {
        render('{{t "foo.bar" tagName="h2"}}');

        Ember.run(function() {
          expect(view.$('h2').html()).to.equal('A Foobar');
        });
      });

      it('handles interpolations from contextual keywords', function() {
        render('{{t "foo.bar.named" nameBinding="view.favouriteBeer" }}', {
          favouriteBeer: 'IPA'
        });

        Ember.run(function() {
          expect(view.$().text()).to.equal('A Foobar named IPA');
        });
      });

      it('responds to updates on bound keyword properties', function() {
        render('{{t "foo.bar.named" nameBinding="view.favouriteBeer"}}', {
          favouriteBeer: 'Lager'
        });

        expect(view.$().text()).to.equal('A Foobar named Lager');

        Ember.run(function() {
          view.set('favouriteBeer', 'IPA');
        });

        Ember.run(function() {
          expect(view.$().text()).to.equal('A Foobar named IPA');
        });
      });
    });

    describe('{{{t}}}', function() {
      it('does not over-escape translations', function() {
        Ember.I18n.translations['message.loading'] = '<span class="loading">Loading…</span>';
        render('<div>{{{t "message.loading"}}}</div>');
        Ember.run(function() {
          expect(view.$('.loading').length).to.equal(1);
          expect(view.$('.loading').text()).to.equal('Loading…');
        });
      });
    });

    describe('{{translateAttr}}', function() {
      it('outputs translated attribute strings', function() {
        render('<a {{translateAttr title="foo.bar" data-disable-with="foo.save.disabled"}}></a>');
        Ember.run(function() {
          expect(view.$('a').attr('title')).to.equal('A Foobar');
          expect(view.$('a').attr('data-disable-with')).to.equal('Saving Foo...');
        });
      });
    });

    describe('TranslateableProperties', function() {

      it('translates ___Translation attributes on the object', function() {
        var subject = Ember.Object.extend(Ember.I18n.TranslateableProperties).create({
          titleTranslation: 'foo.bar'
        });
        expect(subject.get('title')).to.equal('A Foobar');
      });

    });

    describe('TranslatableAttributes', function() {
      it('exists', function() {
        expect(Ember.I18n.TranslatableAttributes).to.not.equal(undefined);
      });

      it('translates ___Translation attributes on the DOM element', function() {
        Ember.View.reopen(Ember.I18n.TranslatableAttributes);
        render('{{view titleTranslation="foo.bar"}}');
        expect(view.$().children().first().attr('title')).to.equal("A Foobar");
      });
    });
  });

}).call(this);
