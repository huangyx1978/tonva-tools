// 因为测试的都是局域网服务器，甚至本机服务器，所以一秒足够了
// 网上找了上面的fetch timeout代码。
// 尽管timeout了，fetch仍然继续，没有cancel
const timeout = 100;
export function fetchLocalCheck(url, options) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(resolve).catch(reject);
        const e = new Error("Connection timed out");
        setTimeout(reject, timeout, e);
    });
}
//# sourceMappingURL=fetchLocalCheck.js.map