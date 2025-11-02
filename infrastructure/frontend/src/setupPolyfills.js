// Polyfills para Node.js - deve ser carregado antes de qualquer outro módulo
import { TextEncoder, TextDecoder } from 'util';

// Polyfills para TextEncoder e TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

// Polyfills para Response e Request (necessários para MSW)
if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || 'OK';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.ok = this.status >= 200 && this.status < 300;
      this._body = body;
    }

    json() {
      return Promise.resolve(typeof this._body === 'string' ? JSON.parse(this._body) : this._body);
    }

    text() {
      return Promise.resolve(typeof this._body === 'string' ? this._body : JSON.stringify(this._body));
    }
  };
}

if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url;
      this.method = init.method || 'GET';
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body;
      this._body = init.body;
    }

    async json() {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body);
      }
      return this._body || {};
    }

    async text() {
      return typeof this._body === 'string' ? this._body : JSON.stringify(this._body || {});
    }
  };
}

// Polyfill para Headers
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this.map = new Map(Object.entries(init));
    }

    get(name) {
      return this.map.get(name.toLowerCase());
    }

    set(name, value) {
      this.map.set(name.toLowerCase(), value);
    }

    has(name) {
      return this.map.has(name.toLowerCase());
    }

    delete(name) {
      this.map.delete(name.toLowerCase());
    }
  };
}

// Polyfill para TransformStream
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = class TransformStream {
    constructor() {
      this.readable = {
        getReader: () => ({
          read: () => Promise.resolve({ done: true, value: undefined })
        })
      };
      this.writable = {
        getWriter: () => ({
          write: () => Promise.resolve(),
          close: () => Promise.resolve()
        })
      };
    }
  };
}

// Polyfill para ReadableStream
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor() {
      this.locked = false;
    }
    getReader() {
      return {
        read: () => Promise.resolve({ done: true, value: undefined }),
        cancel: () => Promise.resolve(),
        releaseLock: () => {}
      };
    }
    cancel() {
      return Promise.resolve();
    }
  };
}

// Polyfill para WritableStream
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = class WritableStream {
    constructor() {
      this.locked = false;
    }
    getWriter() {
      return {
        write: () => Promise.resolve(),
        close: () => Promise.resolve(),
        abort: () => Promise.resolve(),
        releaseLock: () => {}
      };
    }
    abort() {
      return Promise.resolve();
    }
  };
}

// Polyfill para BroadcastChannel
if (typeof global.BroadcastChannel === 'undefined') {
  global.BroadcastChannel = class BroadcastChannel {
    constructor(name) {
      this.name = name;
      this._listeners = [];
    }

    postMessage(message) {
      // No-op para testes
    }

    addEventListener(type, listener) {
      if (type === 'message') {
        this._listeners.push(listener);
      }
    }

    removeEventListener(type, listener) {
      if (type === 'message') {
        const index = this._listeners.indexOf(listener);
        if (index > -1) {
          this._listeners.splice(index, 1);
        }
      }
    }

    close() {
      this._listeners = [];
    }
  };
}

// Polyfill para MessageChannel
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = class MessageChannel {
    constructor() {
      this.port1 = {
        postMessage: () => {},
        close: () => {},
        onmessage: null
      };
      this.port2 = {
        postMessage: () => {},
        close: () => {},
        onmessage: null
      };
    }
  };
}

// Polyfill para MessagePort
if (typeof global.MessagePort === 'undefined') {
  global.MessagePort = class MessagePort {
    constructor() {
      this.onmessage = null;
    }
    postMessage() {
      // No-op para testes
    }
    start() {
      // No-op para testes
    }
    close() {
      // No-op para testes
    }
    addEventListener() {
      // No-op para testes
    }
    removeEventListener() {
      // No-op para testes
    }
  };
}

// Polyfill para fetch
if (typeof global.fetch === 'undefined') {
  global.fetch = async function fetch(url, options = {}) {
    const request = new global.Request(url, options);
    return new global.Response(JSON.stringify({}), { status: 200 });
  };
}

// Polyfill para import.meta (necessário para Jest)
// Define process.env com valores padrão para variáveis VITE usadas nos componentes
if (typeof global.process === 'undefined' || !global.process.env) {
  global.process = global.process || {};
  global.process.env = global.process.env || {};
}

// Define valores padrão para variáveis de ambiente VITE usadas nos testes
global.process.env.VITE_TOAST_AUTOCLOSE_DURATION = global.process.env.VITE_TOAST_AUTOCLOSE_DURATION || '3000';
global.process.env.VITE_API_URL = global.process.env.VITE_API_URL || 'http://localhost:3000';
global.process.env.VITE_GITHUB_REPOSITORY_URL = global.process.env.VITE_GITHUB_REPOSITORY_URL || 'https://github.com/ICEI-PUC-Minas-PMV-SI/pmv-si-2025-2-pe6-t1-g3';
global.process.env.VITE_CONTACT_EMAIL = global.process.env.VITE_CONTACT_EMAIL || 'contato@zabbix.com.br';
global.process.env.VITE_SEARCH_DEBOUNCE_MS = global.process.env.VITE_SEARCH_DEBOUNCE_MS || '500';
global.process.env.VITE_CEP_FETCH_DELAY_MS = global.process.env.VITE_CEP_FETCH_DELAY_MS || '500';

// Polyfill para window.location.reload - permite mockar no Jest/JSDOM
// No JSDOM, window.location é somente leitura, então precisamos definir como configurable
if (typeof window !== 'undefined' && window.location) {
  try {
    // Salvar a referência original se existir
    const originalReload = window.location.reload;
    
    // Tentar definir como configurable para permitir mocks nos testes
    Object.defineProperty(window.location, 'reload', {
      configurable: true,
      value: originalReload || (() => {}),
      writable: true,
    });
  } catch (err) {
    // Se falhar, window.location pode ser totalmente somente leitura
    // Nesse caso, não há muito o que fazer, mas pelo menos não quebra os testes
    console.warn('Não foi possível definir window.location.reload como configurable:', err.message);
  }
}

