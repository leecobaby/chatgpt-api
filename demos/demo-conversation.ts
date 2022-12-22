import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'

import { ChatGPTAPI, getOpenAIAuth } from '../src'

dotenv.config()

/**
 * Demo CLI for testing conversation support.
 *
 * ```
 * npx tsx demos/demo-conversation.ts
 * ```
 */
async function main() {
  const email = process.env.OPENAI_EMAIL
  const password = process.env.OPENAI_PASSWORD

  // const authInfo = await getOpenAIAuth({
  //   email,
  //   password
  // })

  const authInfo = {
    sessionToken: process.env.SESSION_TOKEN,
    clearanceToken: process.env.CLEARANCE_TOKEN,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    headers: {
      Accept: '*/*',
      'Accept-Language': 'zh-CN,zh;q=0.9',
      'accept-encoding': 'gzip, deflate, br',
      'sec-ch-ua':
        '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"'
    }
  }

  const api = new ChatGPTAPI({ ...authInfo })
  await api.initSession()

  const prompt = 'Write a poem about cats.'

  let res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })

  console.log('\n' + res.response + '\n')

  const prompt2 = 'Can you make it cuter and shorter?'

  res = await oraPromise(
    api.sendMessage(prompt2, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt2
    }
  )
  console.log('\n' + res.response + '\n')

  const prompt3 = 'Now write it in French.'

  res = await oraPromise(
    api.sendMessage(prompt3, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt3
    }
  )
  console.log('\n' + res.response + '\n')

  const prompt4 = 'What were we talking about again?'

  res = await oraPromise(
    api.sendMessage(prompt4, {
      conversationId: res.conversationId,
      parentMessageId: res.messageId
    }),
    {
      text: prompt4
    }
  )
  console.log('\n' + res.response + '\n')

  await api.closeSession()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
