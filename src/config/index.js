module.exports = {
    SERVER: ( process.env.SOCKET_HOST || "127.0.0.1"),
    PORT : (process.env.SOCKET_PORT || 5000),
    AUTH_TOKEN: process.env.AUTH_TOKEN || '$2y$10$rOg2BJ.LKMj2XQkZaCbVTed8FCR8tq5cbgTR25/HMKRuQvkSoGVNq',
    PUSH_TOKEN: process.env.PUSH_TOKEN || '$2y$10$RDaBp6C7hGt2AwWHzIpbQeovka6F26gvR0yB8F26IY8EiKrMI6Ljq'
};