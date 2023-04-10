import express from 'express'
import cors from 'cors'
import chalk from 'chalk'

const app = express()
app.use(express.json())
app.use(cors())

const users = []
const tweets = []

app.post("/sign-up", (req, res) => {
  const user = req.body

  if (!user.username || !user.avatar) return res.status(400).send("Todos os campos são obrigatórios!")

  users.push(user)

  res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
  const tweet = req.body.tweet
  const username = req.headers.username

  if (!username || !tweet) return res.status(400).send("Todos os campos são obrigatórios!")

  const userSignUp = users.find(i => i.username === username)

  if (!userSignUp) return res.status(401).send("UNAUTHORIZED")

  tweets.push({ tweet, username })

  res.status(201).send("OK")
})

app.get("/tweets", (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
  
    if (page < 1) {
      return res.status(400).send("Informe uma página válida!");
    }
  
    const twiiterFiltros = tweets.slice().reverse().map((tweet, i) => {
      const usuario = users.find((item) => item.username === tweet.username);
      return {
        username: tweet.username,
        tweet: `> ${tweet.tweet} | ${i}`,
        avatar: usuario.avatar,
      };
    }).slice(startIndex, endIndex);
  
    res.send(twiiterFiltros);
  });
  

  app.get("/tweets/:username", (req, res) => {
    const { username } = req.params
  
    const userTweets = tweets
      .filter(tweet => tweet.username.toLowerCase() === username.toLowerCase())
      .map(tweet => {
        const user = users.find(item => item.username === tweet.username)
        return { ...tweet, avatar: user.avatar }
      })
  
    res.send(userTweets)
  })
  

const PORT = 5000

app.listen(PORT, () => console.log(chalk.blue(`Servidor rodando corretamente na porta ${PORT}`)))
