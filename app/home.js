import App from './app.js'
import store from './store.js'

export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>{store.title}</title>
        <script src="/app/dev-client.js"></script>
        <script src="/app/hydrate.js" type="module"></script>
      </head>
      <body>
      <App />
      </body>
    </html>
  )
}
