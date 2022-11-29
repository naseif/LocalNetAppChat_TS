export class HostingUrlGenerator {
  public static GenerateUrl(server: string, port: number, https: boolean) {
    let result = "";

    result += https ? "https://" : "http://";
    result += server;
    result += ":" + port;

    return result;
  }
}
