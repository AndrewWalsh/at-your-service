/* eslint-disable */
/* tslint:disable */

/**
 * As anyone reading this might guess, getting a service worker to behave
 * is an adventure. This lib has a particularly complex use case
 * making this sort of thing necessary
 *
 * This code is a copy paste from this comment https://stackoverflow.com/a/67612740
 * Adapted to use case
 */

export default async function registerServiceWorker(
  name: string,
  tryOnce = false
) {
  if (!("serviceWorker" in navigator))
    throw new Error("serviceWorker not supported");
  const url = new URL(`/${name}.js`, window.location.href).toString();

  // await navigator.serviceWorker
  //   .getRegistration(url)
  //   .then(function (sw) {
  //     if (sw) {
  //       return sw.update()
  //       // return sw
  //       //   .unregister()
  //       //   .then(() =>
  //       //     navigator.serviceWorker.register(`/${name}.js`, {
  //       //       scope: "./",
  //       //     })
  //       //   );
  //     }
  //   });

  // console.info('Registering worker');
  const registration = await navigator.serviceWorker.register(url, {
    scope: "/",
  });

  const registeredWorker =
    registration.active || registration.waiting || registration.installing;
  // console.info('Registered worker:', registeredWorker);
  if (registeredWorker?.scriptURL != url) {
    // console.log('[ServiceWorker] Old URL:', registeredWorker?.scriptURL || 'none', 'updating to:', url);
    await registration.update();
    // console.info('Updated worker');
  }

  // console.info('Waiting for ready worker');
  let serviceReg;
  try {
    serviceReg = await timeout(1000, navigator.serviceWorker.ready);
  } catch {}
  // console.info('Ready registration:', serviceReg);
  if (!serviceReg) {
    return location.reload();
  }

  if (!navigator.serviceWorker.controller) {
    // console.info('Worker isn’t controlling, re-register');
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      // console.info('Unregistering worker');
      if (!reg) throw Error();
      await reg.unregister();
      // console.info('Successfully unregistered, trying registration again');
      return registerServiceWorker(name);
    } catch (err) {
      // console.error(`ServiceWorker failed to re-register after hard-refresh, reloading the page!`, err);
      return location.reload();
    }
  }

  let serviceWorker =
    serviceReg.active || serviceReg.waiting || serviceReg.installing;
  if (!serviceWorker) {
    // console.info('No worker on registration, getting registration again');
    serviceReg = await navigator.serviceWorker.getRegistration("/");
    serviceWorker =
      serviceReg.active || serviceReg.waiting || serviceReg.installing;
  }

  if (!serviceWorker) {
    // console.info('No worker on registration, waiting 50ms');
    await new Promise((resolve) => window.setTimeout(resolve, 50)); // adjustable or skippable, have a play around
  }

  serviceWorker =
    serviceReg.active || serviceReg.waiting || serviceReg.installing;
  if (!serviceWorker)
    throw new Error("after waiting on .ready, still no worker");

  if (serviceWorker.state == "redundant") {
    // console.info('Worker is redundant, trying again');
    return registerServiceWorker(name);
  }

  if (serviceWorker.state != "activated") {
    // console.info('Worker IS controlling, but not active yet, waiting on event. state=', serviceWorker.state);
    try {
      // timeout is adjustable, but you do want one in case the statechange
      // doesn't fire / with the wrong state because it gets queued,
      // see ServiceWorker.onstatechange MDN docs.
      await timeout(
        100,
        new Promise((resolve) => {
          serviceWorker.addEventListener("statechange", (e) => {
            if (e.target.state == "activated") resolve();
          });
        })
      );
    } catch (err) {
      if (err instanceof TimeoutError) {
        if (serviceWorker.state != "activated") {
          if (tryOnce) {
            // console.info('Worker is still not active. state=', serviceWorker.state);
            throw new Error("failed to activate service worker");
          } else {
            // console.info('Worker is still not active, retrying once');
            return registerServiceWorker(name, true);
          }
        }
      } else {
        // should be unreachable
        throw err;
      }
    }
  }

  // console.info('Worker is controlling and active, we’re good folks!');
  return serviceWorker;
}

export class TimeoutError extends Error {}

/**
 * Run promise but reject after some timeout.
 *
 * @template T
 * @param {number} ms Milliseconds until timing out
 * @param {Promise<T>} promise Promise to run until timeout (note that it will keep running after timeout)
 * @returns {Promise<T, Error>}
 */
export function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new TimeoutError());
    }, ms);

    promise.then(
      (result) => {
        clearTimeout(timer);
        resolve(result);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
