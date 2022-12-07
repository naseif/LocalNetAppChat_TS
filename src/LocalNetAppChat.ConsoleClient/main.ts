import { ArgumentParser } from "argparse";
import fetch from "node-fetch";
import { hostname } from "os";
import { HostingUrlGenerator } from "../LocalNetAppChat.Domain/HostingUrlGenerator";
import crypto from "crypto";
import { Message } from "../LocalNetAppChat.Domain/IMessage";

const parser = new ArgumentParser({
  description: "LocalNetAppChat-Client",
  add_help: true,
});

parser.add_argument("-m", "--message", {
  help: "Message mode",
  action: "store_true",
});

parser.add_argument("-l", "--listener", {
  help: "Listener mode",
  action: "store_true",
});

parser.add_argument("-s", "--server", {
  help: "the server to connect to",
});

parser.add_argument("-p", "--port", {
  help: "The port to listen on",
});

parser.add_argument("--https", {
  help: "Whether it is a http or https server",
  action: "store_true",
});

parser.add_argument("--text", {
  help: "the message text to send to the server if in message mode",
});

parser.add_argument("--clientName", {
  help: "the name of the client to send to the server",
});

const args = parser.parse_args();

let clientName = args.clientName ?? hostname();

let hostingUrl = HostingUrlGenerator.GenerateUrl(
  args.server ?? "",
  Number(args.port) ?? 5000,
  args.https ?? false
);

(async () => {
  try {
    if (args.message) {
      let userMessage = new Message(
        crypto.randomUUID(),
        clientName,
        args.text ?? "",
        [],
        true,
        "Message"
      );

      const req = await fetch(`${hostingUrl}/lnac/v1/send`, {
        method: "post",
        body: JSON.stringify(userMessage),
      });

      console.log(req);
      return;
    }

    if (args.listener) {
      while (true) {
        try {
          const req = await fetch(
            `${hostingUrl}/receive?clientName=${clientName}`
          );
          const messages = (await req.json()) as Message[];

          if (messages.length > 0) {
            for (let message of messages) {
              console.log(`${message.name} : ${message.text}`);
            }
          }
        } catch (error) {
          console.log(`Reestablishing Connection....`);
        }
      }
    }
  } catch (error) {
    console.log("");
    console.log(error);
    console.log("");
  }
})();
