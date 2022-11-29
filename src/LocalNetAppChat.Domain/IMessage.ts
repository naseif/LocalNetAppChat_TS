export interface IMessage {
  id: string;
  name: string;
  text: string;
  tags: string[];
  persistent: boolean;
  type: string;
}

export class Message implements IMessage {
  id: string;
  name: string;
  text: string;
  tags: string[];
  persistent: boolean;
  type: string;

  constructor(
    id: string,
    name: string,
    text: string,
    tags: string[],
    persistent: boolean,
    type: string
  ) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.tags = tags;
    this.persistent = persistent;
    this.type = type;
  }
}
