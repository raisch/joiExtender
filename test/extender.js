'use strict';

/*
 * Created by raisch on 3/12/15.
 */

/*jshint node:true, bitwise:true, camelcase:false, curly:true, undef:false, unused:false, eqeqeq:true, shadow:true */

/*global require, __dirname */

//noinspection JSUnusedGlobalSymbols
var util = require('util'),
    path = require('path'),
    _ = require('lodash'),
    joi = require('joi'),
    chai = require('chai'),
    extender = require(path.join(__dirname, '../lib/extender')),
    is_dma = require('is_dma');

chai.should(); // side effect!!: extends Object.prototype

require('./helpers/chai_extensions'); // side effect!!: extends chai

describe('extender', function () {

  before(function () {
    //noinspection JSUnusedLocalSymbols
    /**
     * Add a new Designated Market Area (dma) validator.
     * @see {@link http://github.com/raisch/is_dma}
     */
    extender.addValidator('dma', {
      errmsgs: {
        base: 'must be a string',
        invalid: 'is not a valid dma',
        badFoo: 'is not foo-worthy'
      },
      requirements: {
        base: _.isString,
        invalid: is_dma
      },
      tests: {
        isFoo: function (value, args) {
          if ('502' === value) return 'badFoo';
        }
      }
    });
    /**
     * And register it with joi.
     */
    extender.registerType(joi, 'dma');
  });

  it('should support adding a new validator', function () {
    joi.should.have.property('dma');
  });

  it('should not validate without a value', function () {
    //noinspection JSUnusedAssignment
    var value,
        result = joi.dma().required().label('dma').validate(value);
    result.should.have.errmsg('"dma" is required');
  });

  it('should not validate with a non-string', function () {
    var value = 1,
        result = joi.dma().required().label('dma').validate(value);
    result.should.have.errmsg('"dma" must be a string');
  });

  it('should not validate with a bad dma', function () {
    var result = joi.dma().required().label('dma').validate('100');
    result.should.have.errmsg('"dma" is not a valid dma');
  });

  it('should validate with a good dma', function () {
    var result = joi.dma().required().label('dma').validate('501');
    //noinspection BadExpressionStatementJS
    result.should.not.have.errmsgs;
  });

  it('should not validate with a non-foo-worthy dma', function () {
    var result = joi.dma().required().isFoo().label('dma').validate('502');
    //console.log(util.inspect(result,{depth:null}));
    result.should.have.errmsg('"dma" is not foo-worthy');
  });

});