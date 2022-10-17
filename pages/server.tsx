import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import Layout from "../components/layout"

import type { GetServerSidePropsContext } from "next"
import type { Session } from "next-auth"

// /server
export default function ServerSidePage({ session }: { session: Session }) {
  // As this page uses Server Side Rendering, the `session` will be already
  // populated on render without needing to go through a loading stage.
  return (
    <Layout>
      <h1>Server Side Rendering</h1>
      <p>
        This page uses the <strong>unstable_getServerSession()</strong> method
        in <strong>unstable_getServerSideProps()</strong>.
      </p>
      <p>
        Using <strong>unstable_getServerSession()</strong> in{" "}
        <strong>unstable_getServerSideProps()</strong> is the recommended
        approach if you need to support Server Side Rendering with
        authentication.
      </p>
      <p>
        The advantage of Server Side Rendering is this page does not require
        client side JavaScript.
      </p>
      <p>
        The disadvantage of Server Side Rendering is that this page is slower to
        render.
      </p>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </Layout>
  )
}

// 写了这个钩子函数，那么这个session参数便会随页面传送给客户端，客户端混合后的逻辑是重用这个session

// 导出 `session` 属性以使用带有服务器端渲染的会话
// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}
