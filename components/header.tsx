import Link from "next/link"
import { signIn, signOut, useSession } from "next-auth/react"
import styles from "./header.module.css"

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession()
  const loading = status === "loading"

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={styles.signedInStatus}>
        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault()
                  signIn() // 未登录点击登录
                  // 此函数是next-auth/react中提供的方法
                  // 当前没有传入provider参数，所以它里面的逻辑是直接location.href = /api/auth/signin?callbackUrl=xxx 注意它是get请求
                  // 那么浏览器就会访问这个链接 - 这个例子中就会收到这样的请求，在next-auth内部就会返回默认的登录页面啦 ~
                  // 在登录页面中点击github登录就会发送/api/auth/signin/github?xxx，只不过它是post请求，和上面的是不一样的逻辑的
                  // 这个返回的是302响应 location为github三方登录的地址，之后浏览器就会自动访问这个location地址
                  // 注意这个location地址中的redirect_url参数是传给github的，它是登录成功后github回调的地址
                  // 这个地址就是/api/auth/callback/github?xxx，在这个里面的逻辑就是根据session的策略来进行存储session啦
                  // 然后返回cookie和302响应 location为callbackUrl，这个callbackUrl可以通过req的body中的或者是req的query的callbackUrl参数来去决定设置的
                  // 然后浏览器就访问这个设置的callbackUrl啦 ~
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                  className={styles.avatar}
                />
              )}
              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
      <nav>
        <ul className={styles.navItems}>
          <li className={styles.navItem}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/client">
              <a>Client</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/server">
              <a>Server</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/protected">
              <a>Protected</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/api-example">
              <a>API</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/admin">
              <a>Admin</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/me">
              <a>Me</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
