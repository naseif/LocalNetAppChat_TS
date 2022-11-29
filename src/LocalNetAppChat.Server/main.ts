import { ArgumentParser } from "argparse";
import { APIController } from "api-tools-ts";
import { MessageList } from "../LocalNetAppChat.Domain/MessageList";
import { Message } from "../LocalNetAppChat.Domain/IMessage";

const parser = new ArgumentParser({
  description: "LocalNetAppChat-Server",
  add_help: true,
});

parser.add_argument("-l", "--listenOn", {
  help: "IP or DNS to listen on",
});

parser.add_argument("-p", "--port", {
  help: "The port to listen on",
});

parser.add_argument("--https", {
  help: "The Release Group to add to the filename",
  action: "store_true",
});

const args = parser.parse_args();

if (!args.listenOn || !args.port) {
  throw new Error(
    "Some CMD arguments are missing, please make sure you are launching the server with the right arguments."
  );
}

const api = new APIController("/lnac/v1");
const messageList = new MessageList();

api.port = Number(args.port) ?? 51337;
api.hostname = args.listenOn ?? "localhost";

api.AddEndPoint("/", "get", (req, res) => {
  return res.status(200).send("LocalNetAppChat Server!");
});

api.AddEndPoint("/receive", "get", (req, res) => {
  if (!req.query.clientName)
    return res.status("404").send("Bad Request, clientName missing!");
  const messages = messageList.GetMessagesForClient(req.query.clientName);
  console.log(
    `- client ${req.query.clientName} has requested messages... sending ${messages.length} messages`
  );
  return res.status(200).json(messages);
});

api.AddEndPoint("/send", "post", (req, res) => {
  let messageFromClient;
  if (Object.keys(req.body).length === 0) {
    return res.status(404).send("Bad Request, No Message received");
  }

  messageFromClient = req.body as Message;
  console.log(
    `- client ${messageFromClient?.name} has sent us a new message...`
  );
  messageList.Add(messageFromClient);
  return res.status(201).json(messageFromClient);
});

api.startServer({ useDefaultMiddlewares: "true" });
