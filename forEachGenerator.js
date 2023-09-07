function* foreach(arr, fn) {
  var i;

  for (i = 0; i < arr.length; i++) {
    yield * fn(arr[i]);
  }
}

module.exports = foreach;
