export const LocalStorageEventTarget = new EventTarget()

// public events  clearLocalStorage
export const clearLocalStorage = () => {
  localStorage.clear()
  LocalStorageEventTarget.dispatchEvent(new Event('clearLocalStorage'))
}
