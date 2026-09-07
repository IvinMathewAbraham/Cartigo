// Global Jest Setup
BigInt.prototype.toJSON = function () {
  return this.toString();
};
