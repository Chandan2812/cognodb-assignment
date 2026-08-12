const toNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value.toNumber === "function") {
    return value.toNumber();
  }

  if (typeof value === "object" && "low" in value && "high" in value) {
    return value.low;
  }

  return Number(value);
};

module.exports = {
  toNumber,
};
