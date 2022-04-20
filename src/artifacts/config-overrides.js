module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    config.ignoreWarnings = [/Failed to parse source map/];

    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url")
    })
    config.resolve.fallback = { ...fallback, path: false, fs: false };

    return config;
}