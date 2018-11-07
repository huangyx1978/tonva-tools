// 因为测试的都是局域网服务器，甚至本机服务器，所以一秒足够了
// 网上找了上面的fetch timeout代码。
// 尽管timeout了，fetch仍然继续，没有cancel

// 实际上，一秒钟不够。web服务器会自动停。重启的时候，可能会比较长时间。也许两秒甚至更多。
const timeout = 2000;

export function fetchLocalCheck(url, options?:any):Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(url, options).then(resolve).catch(reject);
      const e = new Error("Connection timed out");
      setTimeout(reject, timeout, e);
    });
}
