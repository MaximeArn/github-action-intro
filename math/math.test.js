const { add } = require("./math.js");

describe("add function", () => {
  it("it should add two positive numbers", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it("it should add two negative numbers", () => {
    const result = add(-5, -12);
    expect(result).toBe(-17);
  });
  it("should throw error if not mumber passed", () => {
    expect(() => add("str", 4).toThrow(Error));
  });
});
