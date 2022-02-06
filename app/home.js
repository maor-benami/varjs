import App from './app.js'

export default function Home() {
  return (
    <html lang="en">
      <head>
        <script src="/app/dev-client.js"></script>
      </head>
      <body>
      <App context={{ title: 'context' }}/>
      </body>
    </html>
  )
}
