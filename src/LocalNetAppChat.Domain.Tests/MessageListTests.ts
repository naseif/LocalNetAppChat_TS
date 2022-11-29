import "jest";
import { Message } from "../LocalNetAppChat.Domain/IMessage";
import { MessageList } from "../LocalNetAppChat.Domain/MessageList";
import crypto from "crypto";

describe("MessageListTests", () => {
  let message = new Message(
    crypto.randomUUID(),
    "NaseifBigBoss",
    "HeyThere",
    [],
    true,
    "Message"
  );

  it("should add messages to the list", () => {
    const messageList = new MessageList();
    messageList.Add(message);
  });

  it("should retrieve messages", () => {
    const messageList = new MessageList();
    messageList.Add(message);
    var messagesForClient = messageList.GetMessagesForClient("Blubberbär");
    expect(messagesForClient).toHaveLength(1);
  });

  it("Calling retrieve remembers the last message that has been retrieved for the client", () => {
    const messageList = new MessageList();
    messageList.Add(message);

    messageList.GetMessagesForClient("Blubberbär");
    const messagesForClient = messageList.GetMessagesForClient("Blubberbär");

    expect(messagesForClient).toHaveLength(0);
  });
});
