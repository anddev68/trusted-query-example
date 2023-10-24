import fs from "fs"
import crypto from "crypto"

// ブラウザバンドルには公開しない共通鍵
const SECRET_KEY = "12345"

// createHmacは使い回しが効くのでインスタンス化
const instance = crypto.createHmac("sha1", SECRET_KEY)

async function main() {
    // GraphQL CodegenかRelay Compilerによって生成されるクエリを想定
    const queriesFile = fs.readFileSync('./queries.json');
    const queries = JSON.parse(queriesFile)

    // query: hmacのペアを作成
    const trustedQueries = queries.reduce((trustedQueries, query) => {
        const hmac = instance.update(query).digest('hex')
        return {
            ...trustedQueries,
            [query]: hmac
        }
    }, {})

    console.log(trustedQueries)

    fs.writeFileSync('./trustedQueries.json', JSON.stringify(trustedQueries));
}

main()