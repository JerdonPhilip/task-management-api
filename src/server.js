import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import router from "./routes/index.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use("/api", router)

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task Management RPG API" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
