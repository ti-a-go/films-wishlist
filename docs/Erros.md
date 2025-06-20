# Permission error in `dist/` folder

When running the `npm run ci` script we can get the following:

```sh
> films-wishlist@0.0.1 ci
> npm run build && npm run format && npm run lint && npm run test

> films-wishlist@0.0.1 build
> nest build

Error  EACCES: permission denied, unlink '/home/tiago/films-wishlist/dist/app.module.d.ts'
```

Solution:

```ah
sudo chown -R $USER /home/tiago/films-wishlist/dist
```


# Erro de Authenticação

```shell
films-wishlist-api  | [Nest] 29  - 05/26/2025, 11:13:08 PM     LOG [AuthenticationGuard] ERROR - {
    "host": "localhost:3000",
    "user-agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:138.0) Gecko/20100101 Firefox/138.0",
    "accept": "*/*",
    "accept-language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3",
    "accept-encoding": "gzip, deflate, br, zstd",
    "referer": "http://localhost:3000/api",
    "content-type": "application/json",
    "content-length": "23",
    "origin": "http://localhost:3000",
    "connection": "keep-alive",
    "cookie": "ajs_anonymous_id=b0aed87c-1c6d-4f2c-b966-5297859dc5d5; csrftoken=fHcorNXiwAAx6IPy5nraWUIKyJpbE1Ma",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "priority": "u=0"
}
```