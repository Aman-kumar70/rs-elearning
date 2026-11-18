/**
 * Lifecycle isolation for the existing imperative canvas/widget controllers.
 *
 * React owns the page and its DOM. The original lab code still needs to attach
 * events, start animation frames and schedule timers, so this scope records
 * those resources while the route is mounted and releases them on unmount.
 */
export function installPageCleanup() {
  const disposers = [];
  const rafIds = new Set();
  const timeoutIds = new Set();
  const intervalIds = new Set();

  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  const originalRaf = window.requestAnimationFrame;
  const originalCancelRaf = window.cancelAnimationFrame;
  const originalSetTimeout = window.setTimeout;
  const originalClearTimeout = window.clearTimeout;
  const originalSetInterval = window.setInterval;
  const originalClearInterval = window.clearInterval;

  let setupFinished = false;
  let disposed = false;

  EventTarget.prototype.addEventListener = function trackedAddEventListener(
    type,
    listener,
    options,
  ) {
    const result = originalAddEventListener.call(this, type, listener, options);
    disposers.push(() => {
      originalRemoveEventListener.call(this, type, listener, options);
    });
    return result;
  };

  window.requestAnimationFrame = function trackedRequestAnimationFrame(
    callback,
  ) {
    const id = originalRaf.call(window, (time) => {
      rafIds.delete(id);
      callback(time);
    });
    rafIds.add(id);
    return id;
  };

  window.cancelAnimationFrame = function trackedCancelAnimationFrame(id) {
    rafIds.delete(id);
    return originalCancelRaf.call(window, id);
  };

  window.setTimeout = function trackedSetTimeout(callback, delay, ...args) {
    let id;
    const wrapped =
      typeof callback === "function"
        ? (...callbackArgs) => {
            timeoutIds.delete(id);
            callback(...callbackArgs);
          }
        : callback;
    id = originalSetTimeout.call(window, wrapped, delay, ...args);
    timeoutIds.add(id);
    return id;
  };

  window.clearTimeout = function trackedClearTimeout(id) {
    timeoutIds.delete(id);
    return originalClearTimeout.call(window, id);
  };

  window.setInterval = function trackedSetInterval(callback, delay, ...args) {
    const id = originalSetInterval.call(window, callback, delay, ...args);
    intervalIds.add(id);
    return id;
  };

  window.clearInterval = function trackedClearInterval(id) {
    intervalIds.delete(id);
    return originalClearInterval.call(window, id);
  };

  function finishSetup() {
    if (setupFinished || disposed) return;
    setupFinished = true;
    EventTarget.prototype.addEventListener = originalAddEventListener;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;

    EventTarget.prototype.addEventListener = originalAddEventListener;
    window.requestAnimationFrame = originalRaf;
    window.cancelAnimationFrame = originalCancelRaf;
    window.setTimeout = originalSetTimeout;
    window.clearTimeout = originalClearTimeout;
    window.setInterval = originalSetInterval;
    window.clearInterval = originalClearInterval;

    rafIds.forEach((id) => originalCancelRaf.call(window, id));
    timeoutIds.forEach((id) => originalClearTimeout.call(window, id));
    intervalIds.forEach((id) => originalClearInterval.call(window, id));
    rafIds.clear();
    timeoutIds.clear();
    intervalIds.clear();

    disposers.forEach((remove) => {
      try {
        remove();
      } catch {
        /* a detached target is already safe to drop */
      }
    });
    disposers.length = 0;
  }

  return { finishSetup, dispose };
}
