module.exports = {
  encode: function(i){
    return (i%2) ? i+2 : i+4;
  },
  decode: function(i){
    return (i%2) ? i-2 : i-4;
  }
};
