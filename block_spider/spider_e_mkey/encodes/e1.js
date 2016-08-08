module.exports = {
  encode: function(item){
    return item-3;
  },
  decode: function(item){
    return item+3*(+!(typeof document === 'undefined'));
  }
};
