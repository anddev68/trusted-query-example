import { createServer } from 'node:http'
import { createYoga } from 'graphql-yoga'
import { schema } from './schema.mjs'
import crypto from "crypto"
 
const SECRET_KEY = "12345"

function useTrustedQuery () {
  return {
    onParams: (payload) => {
      const { request, params, setParams } = payload
      const {query, hmac} = params

      // SECRET_KEYを知らない人はクエリに対応するHMACを作ることができないので、
      // HMACの検証が通れば、そのクエリはSECRET_KEYを知っている人が作ったクエリであることが証明できる
      const correct = crypto.createHmac("sha1", SECRET_KEY).update(query).digest('hex')
      console.log({query, hmac, correct})

      if(correct !== hmac) {
        throw new Error("hmac is not match.")
      }

      setParams({query})
    },
    onParse: ({ setParsedDocument, context: { request } }) => {

    }
  }
}

// Create a Yoga instance with a GraphQL schema.
const yoga = createYoga({ schema, plugins: [ useTrustedQuery() ] })
 
// Pass it into a server to hook into request handlers.
const server = createServer(yoga)
 
// Start the server and you're done!
server.listen(4000, () => {
  console.info('Server is running on http://localhost:4000/graphql')
})