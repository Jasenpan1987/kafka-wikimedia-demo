import { getEnv } from "./env";

describe("test env", () => {
  beforeEach(() => {
    const originalEnv = process.env;
    jest.resetModules();
    process.env = {
      ...originalEnv,
      AUTHOR: "Jasen"
    };
  });

  it("Should get Jasen for AUTHOR key", () => {
    const author = getEnv("AUTHOR");
    expect(author).toEqual("Jasen");
  });

  it("Should get undefined for None exist env key", () => {
    const author = getEnv("BAD_KEY");
    expect(author).not.toBeDefined();
  });
});
