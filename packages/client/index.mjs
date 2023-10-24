import axios from "axios"
import fs from "fs"

function getHMAC (query) {
    const file = fs.readFileSync("./trustedQueries.json")
    const queries = JSON.parse(file)
    if(query in queries) {
        return queries[query]
    }
    throw new Error("HMAC was not found in list.")
}

async function main() {
    // 正常系
    try {
        // 送信側は、クエリとHMACをセットで送る
        // HMACはあらかじめビルドしておいた値を利用できるため、
        // SECRET_KEYをブラウザに公開する必要はない
        const query = "{\n  hello\n}"
        const hmac = getHMAC(query)
        const response = await axios.post("http://localhost:4000/graphql", {query, hmac})
        const data = response.data.data
        // { hello: 'world' } が 帰ってくればOK
        console.log(data)
    } catch(e) {
        console.log(e)
    }

    // 異常系
    try {
        const query = "{\n  hello\n}"
        const hmac = getHMAC(query)
        // Trustedではないクエリに変えてみる
        // ここでは、スペースが1個入れて別のクエリを実現している
        const query2 =  "{\n  hello \n}"
        const response = await axios.post("http://localhost:4000/graphql", {query: query2, hmac})
        const data = response.data.data
        console.log(data)
    } catch(e) {
        // クエリとHMACが合わないのでエラーになる
        console.log(e)
    }
}

main()