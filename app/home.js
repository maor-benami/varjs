import App from './app.js'

export default function Home(props) {
  console.log({ props })
  return (
    <html lang="en">
      <head>
        <script src="/app/dev-client.js"></script>
      </head>
      <body>
      <App />
      </body>
    </html>
  )
}
