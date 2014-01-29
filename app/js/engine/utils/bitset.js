/**
 * A bitset operator. 
 * This is not our code. We took it from here: https://github.com/tdegrunt/bitset. Then we transformed it to be functional style.
 */

goog.provide('CrunchJS.Utils.BitSetOperator');

/**
 * Creates an instance. Do not use. Rather, use the getInstance() method.
 * @constructor
 * @class Static class to operate on bitsets
 */
CrunchJS.Utils.BitSetOperator = function() {
  this.bitsPerWord = 32;
  this.addressBitsPerWord = 5;
};

goog.addSingletonGetter(CrunchJS.Utils.BitSetOperator);

/**
 * Returns the new bitset data
 * @return {Array} The new bitset
 */
CrunchJS.Utils.BitSetOperator.prototype.createBitSet = function() {
  return [];
};

CrunchJS.Utils.BitSetOperator.prototype.wordIndex = function(pos) {
  return pos >> this.addressBitsPerWord;
};

CrunchJS.Utils.BitSetOperator.prototype.set = function(set, pos) {
  return set[this.wordIndex(pos - 1)] |= 1 << pos - 1;
};

CrunchJS.Utils.BitSetOperator.prototype.clear = function(set, pos) {
  return set[this.wordIndex(pos - 1)] &= 0xFF ^ (1 << pos - 1);
};

CrunchJS.Utils.BitSetOperator.prototype.get = function(set, pos) {
  return (set[this.wordIndex(pos - 1)] & (1 << pos - 1)) !== 0;
};

CrunchJS.Utils.BitSetOperator.prototype.length = function(set) {
  if (this.wordLength(set) === 0) {
    return 0;
  } else {
    return this.bitsPerWord * (this.wordLength(set) - 1) + (set[this.wordLength(set) - 1].toString(2).length + 1);
  }
};

CrunchJS.Utils.BitSetOperator.prototype.wordLength = function(set) {
  var length, pos, _ref;
  length = set.length;
  for (pos = _ref = set.length - 1; _ref <= 0 ? pos <= 0 : pos >= 0; _ref <= 0 ? pos++ : pos--) {
    if (set[pos] !== 0) break;
    length--;
  }
  return length;
};

CrunchJS.Utils.BitSetOperator.prototype.cardinality = function(set) {
  var pos, sum, _ref;
  sum = 0;
  for (pos = 0, _ref = this.length(); 0 <= _ref ? pos <= _ref : pos >= _ref; 0 <= _ref ? pos++ : pos--) {
    if (this.get(set, pos)) sum++;
  }
  return sum;
};

CrunchJS.Utils.BitSetOperator.prototype.toString = function(set) {
  var pos, result, _ref;
  result = [];
  for (pos = 0, _ref = this.length(); 0 <= _ref ? pos <= _ref : pos >= _ref; 0 <= _ref ? pos++ : pos--) {
    if (this.get(set, pos)) result.push(pos);
  }
  return "{" + (result.join(",")) + "}";
};

CrunchJS.Utils.BitSetOperator.prototype.toBinaryString = function(set) {
  var lpad;
  var _this = this;
  lpad = function(str, padString, length) {
    while (str.length < length) {
      str = padString + str;
    }
    return str;
  };
  if (this.wordLength(set) > 0) {
    return set.map(function(word) {
      return lpad(word.toString(2), '0', _this.bitsPerWord);
    }).join('');
  } else {
    return lpad('', 0, this.bitsPerWord);
  }
};

CrunchJS.Utils.BitSetOperator.prototype.or = function(set, set1) {
  var pos, wordsInCommon, _ref;
  if (this === set1) return;
  wordsInCommon = Math.min(this.wordLength(set), this.wordLength(set1));
  for (pos = 0, _ref = wordsInCommon - 1; 0 <= _ref ? pos <= _ref : pos >= _ref; 0 <= _ref ? pos++ : pos--) {
    set[pos] |= set1[pos];
  }
  if (wordsInCommon < this.wordLength(set1)) {
    set = set.concat(set1.slice(wordsInCommon, this.wordLength(set1)));
  }
  return null;
};

CrunchJS.Utils.BitSetOperator.prototype.and = function(set, set1) {
  var pos, _ref, _ref2, _ref3;
  if (this === set1) return;
  for (pos = _ref = this.wordLength(set), _ref2 = this.wordLength(set1); _ref <= _ref2 ? pos <= _ref2 : pos >= _ref2; _ref <= _ref2 ? pos++ : pos--) {
    set[pos] = 0;
  }
  for (pos = 0, _ref3 = this.wordLength(set); 0 <= _ref3 ? pos <= _ref3 : pos >= _ref3; 0 <= _ref3 ? pos++ : pos--) {
    set[pos] &= set1[pos];
  }
  return null;
};

CrunchJS.Utils.BitSetOperator.prototype.andNot = function(set, set1) {
  var pos, _ref;
  for (pos = 0, _ref = Math.min(this.wordLength(set), this.wordLength(set1)) - 1; 0 <= _ref ? pos <= _ref : pos >= _ref; 0 <= _ref ? pos++ : pos--) {
    set[pos] &= ~set1[pos];
  }
  return null;
};

CrunchJS.Utils.BitSetOperator.prototype.xor = function(set, set1) {
  var pos, _ref;
  if (this === set1) return;
  for (pos = 0, _ref = this.wordLength(set); 0 <= _ref ? pos <= _ref : pos >= _ref; 0 <= _ref ? pos++ : pos--) {
    set[pos] ^= set1[pos];
  }
  return null;
};
