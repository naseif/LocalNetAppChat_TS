import "jest";
import { HostingUrlGenerator } from "../LocalNetAppChat.Domain/HoostingUrlGenerator";

describe("HoostingUrlGenerator.Tests", () => {
  it("should generate https links correctly", () => {
    const url = HostingUrlGenerator.GenerateUrl("192.168.178.22", 51337, true);
    expect(url).toEqual("https://192.168.178.22:51337");
  });

  it("should generate http links correctly", () => {
    const url = HostingUrlGenerator.GenerateUrl("192.168.178.22", 51337, false);
    expect(url).toEqual("http://192.168.178.22:51337");
  });
});
