const add = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number")
    throw new Error("one of the two arguments passed to add is not a number");
  return a + b;
};

const substract = (a, b) => {
  if (typeof a !== "number" || typeof b !== "number")
    throw new Error(
      "one of the two arguments passed to substract is not a number",
    );
  return a - b;
};

module.exports = {
  add,
  substract,
};
