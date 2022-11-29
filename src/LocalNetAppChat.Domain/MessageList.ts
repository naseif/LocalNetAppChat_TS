import { IMessage, Message } from "./IMessage";

export class MessageList {
  private readonly _messages: Message[] = [];
  private readonly _clientStates = new Map<string, number>();

  public Add(message: Message) {
    this._messages.push(message);
  }

  public GetMessagesForClient(clientId: string) {
    if (!this._clientStates.has(clientId)) {
      this._clientStates.set(clientId, -1);
    }

    let result: Message[] = [];

    if (this._clientStates.get(clientId)) {
      let lastSubmittedIndex = this._clientStates.get(clientId);
      let lastCurrentIndex = this._messages.length - 1;

      for (
        let i = lastSubmittedIndex ?? 0 + 1;
        i < this._messages.length;
        i++
      ) {
        result.push(this._messages[i]);
      }
      this._clientStates.set(clientId, lastCurrentIndex);
    }

    return result.filter((v) => v !== undefined);
  }
}
