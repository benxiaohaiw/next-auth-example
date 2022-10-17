import { SessionProvider } from "next-auth/react"
import "./styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps }, // 解释一下在他的这个例子中，当前这个session只有在访问/server请求时才会有，因为在server.tsx中写了getServerSideProps钩子
  // 然后返回了session参数，所以才会有，而其它请求url中是没有写这个钩子的，所以也就必定是没有的啦 ~
  // 所以这也就分为了到底是在server端做，还是在client端做的两种方式啦 ~
}: AppProps<{ session: Session }>) {
  return (
    // 将session传给SessionProvider组件
    // 在/client中那么这个session就会是undefined，那么在SessionProvider中的逻辑是会向https://next-auth-example.vercel.app/api/auth/session发送请求
    // 当然没有登录的话，这个请求返回的是空对象{}
    // 
    // 但是如果是在登录之后且访问的是/server的话，这个session是有值的，那么在SessionProvider中逻辑是会去重用这个session的

    // 以上就是两者的不同
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
