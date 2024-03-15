import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup?version=3.0';

class ChatGPTMessage extends Service {
  static {
    Service.register(this);
  }

  _role = '';
  _content = '';
  _thinking = false;
  _parserState = {
    parsed: '',
    stack: [],
  };

  constructor(role, content, thinking = false) {
    super();
    this._role = role;
    this._content = content;
    this._parserState.parsed = content;
    this._thinking = thinking;
  }

  get role() { return this._role }
  set role(role) { this._role = role; this.emit('changed') }

  get content() { return this._content }
  set content(content) { this._content = content; this.emit('changed') }

  get label() { return this._parserState.parsed + this._parserState.stack.join('') }

  get thinking() { return this._thinking }
  set thinking(thinking) { this._thinking = thinking; this.emit('changed') }

  _parseDelta(delta) {
    this._parserState.parsed += delta;
  }

  addDelta(delta) {
    if (this._thinking) {
      this._thinking = false;
      this._content = delta;
      this._parseDelta(delta);
    }
    else {
      this._content += delta;
      this._parseDelta(delta);
    }
    this.emit('changed');
  }

}

class ChatGPTService extends Service {
  static {
    Service.register(this, {
      'newMsg': ['int'],
      'clear': [],
    });
  }

  openAIAPIKey = Settings.getSetting('openaiKey');
  messages = [];
  _decoder = new TextDecoder();
  url = GLib.Uri.parse('https://api.openai.com/v1/chat/completions', GLib.UriFlags.NONE);

  get messages() { return this.messages }

  get lastMessage() { return this.messages[this.messages.length - 1] }

  clear() {
    this.messages = []
    this.emit('clear');
  }

  readResponse(stream, aiResponse) {
    stream.read_line_async(
      0, null,
      (stream, res) => {
        if (!stream) {
          return;
        }
        const [bytes] = stream.read_line_finish(res);
        const line = this._decoder.decode(bytes);
        if (line && line != '') {
          let data = line.substr(6);
          if (data == '[DONE]') return;
          const result = JSON.parse(data);
          if (result.choices[0].finish_reason === 'stop') return;
          aiResponse.addDelta(result.choices[0].delta.content);
        }
        this.readResponse(stream, aiResponse);
      });
  }

  send(msg) {
    this.messages.push(new ChatGPTMessage('user', msg));
    this.emit('newMsg', this.messages.length - 1);
    const aiResponse = new ChatGPTMessage('assistant', 'thinking...', true)
    this.messages.push(aiResponse);
    this.emit('newMsg', this.messages.length - 1);

    const body = {
      model: "gpt-3.5-turbo",
      messages: this.messages.map(msg => { let m = { role: msg.role, content: msg.content }; return m; }),
      stream: true,
    };

    const session = new Soup.Session();
    const message = new Soup.Message({
      method: 'POST',
      uri: this.url,
    });
    message.request_headers.append('Authorization', 'Bearer ' + this.openAIAPIKey);
    message.set_request_body_from_bytes('application/json', new GLib.Bytes(JSON.stringify(body)));

    session.send_async(message, GLib.DEFAULT_PRIORITY, null, (_, result) => {
      const stream = session.send_finish(result);
      this.readResponse(new Gio.DataInputStream({
        close_base_stream: true,
        base_stream: stream
      }), aiResponse);
    });
  }
}

export default class ChatGPT {

  static { Service.ChatGPT = this; }
  static _instance = new ChatGPTService();

  static get instance() {
    Service.ensureInstance(ChatGPT, ChatGPTService);
    return ChatGPT._instance;
  }

  static send(msg) { ChatGPT.instance.send(msg) }
  static clear() { ChatGPT.instance.clear() }
  static get messages() { return ChatGPT.instance.messages }
  static get lastMessage() { return ChatGPT.instance.lastMessage }

}

