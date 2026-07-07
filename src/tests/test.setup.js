import "@testing-library/jest-dom";

// Node 22+ deneysel global localStorage, jsdom'un window.localStorage'ını
// gölgeliyor ve --localstorage-file ayarlı olmadığı için bozuk çalışıyor
// (getItem undefined). Bu yüzden localStorage tabanlı testler, öğrencinin
// kodu doğru olsa bile patlıyordu. Test ortamı için çalışan bir in-memory
// localStorage polyfill'i koyuyoruz (eski Node sürümlerinde de zararsız).
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  get length() {
    return Object.keys(this.store).length;
  }
  key(index) {
    return Object.keys(this.store)[index] ?? null;
  }
}

const localStorageMock = new LocalStorageMock();
Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  configurable: true,
  writable: true,
});
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  configurable: true,
  writable: true,
});
