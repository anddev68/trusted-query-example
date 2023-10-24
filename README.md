## QuickStart

```
pnpm i
pnpm -C packages/server dev

pnpm -C packages/client build
pnpm -C packages/client dev
```

## 解説

### クライアント側の話

```
pnpm -C packages/client build
```

によって、queries.jsonにあるクエリごとにHMACを生成します。
このHMACはSECRET_KEYを知らない人には作ることはできません。


```
pnpm -C packages/client dev
```

これにより、query + hmacをサーバに投げてみます。
この時、queryを変えるとhmacは不正な値になります。
変えたqueryに対して正しいhmacを生成するにはSECRET_KEYを知っている必要があります。
