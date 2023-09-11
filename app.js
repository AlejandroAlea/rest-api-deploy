// Producto Final///////////////////////////
const express = require('express') // require -> commonJS
const crypto = require('node:crypto')
const cors = require('cors')

const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))
app.disable('x-powered-by') // deshabilitar el header X-Powered-By: Express

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    // 422 Unprocessable Entity
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  // en base de datos
  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})







// SIN EL USO DEL MIDDLEWARE DE CORS

// const express = require('express') //require xq usamos commonJS
// const crypto = require('node:crypto')
// const cors = require('cors') //middleware cors

// const movies = require('./movies.json')
// const { validateMovie, validatePartialMovie } = require('./Schemas/movies')

// const app = express()
// app.use(express.json()) //para que en el post se pase el eq.body(clase2/3.express.js)

// //app.use(cors()) esto es cors de si a todos, lo mismo que el cors de '*'
// app.use(cors({      
//   const ACCEPTED_ORIGINS = [  //origin para aceptar sin usar el 
//     'http://localhost:8080',
//     'http://localhost:1234',
//     'http://movies.com',
//     'http://AAle',
//   ]
// }))
// app.disable('x-powered-by') //deshabilitar el header x-powered-by de express

// /* app.get('/', (req, res) => {
//  /*  // leer el query param de format esto es para devolver en el formato que pida el cliente, no es muy comun
//   const format = req.query.format
//   if( format === 'xml'){
//     res.send(aqui variable.xml)
//   } 
//   res.json({ message: 'hola mundo aqui' })
// }) */

// //metodos normales: GET/HEAD/POST/////////////////////////////////
// //metodos complejos: PUT/PATCH/DELETE

// //CORS: Cross Origin Resource Sharing
// //CORS PRE-FLIGHT
// //OPTIONS -> peticion previa

// /* const ACCEPTED_ORIGINS = [  //origin para aceptar sin usar el 
//   'http://localhost:8080',        middleware cors
//   'http://localhost:1234',
//   'http://movies.com',
//   'http://AAle',
// ] */

// // todos los recursos que sean MOVIES se identifica con /movies
// app.get('/movies', (req, res) => {

// /* NO NECESARIO CON EL CORS

//   const origin = req.header('origin')         //guardado en origin que es lo que pasa el navegador
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {   // este bloque if es para los cors permitidos
//     //cuando la peticion es del mismo ORIGIN
//     //http://localhost:1234 --> http://localhost:1234 es decir este es el caso cuando el navegador no envia el origin
//     res.header('Access-Control-Allow-Origin', origin) //a donde vamos a acceder
//   }
//   // res.header('Access-Control-Allow-Origin', '*') //cors (todo los origenes que no sean nuestro origen puede acceder '*')
//  */
//   const { genre } = req.query
//   if (genre) {
//     const filteredMovies = movies.filter(                                            // filtrar por genre(este caso genero)
//       movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())  //para poder escribir el parametro con o sin mayuscula y lo capte, some es para casos de sensibilidad
//     )
//     return res.json(filteredMovies)  // para devolverlo
//   }
//   res.json(movies)
// })

// app.get('/movies/:id', (req, res) => { // path-to-regexp(es una biblioteca), parametros de la url
//   const { id } = req.params
//   const movie = movies.find(movie => movie.id === id)
//   if (movie) return res.json(movie)

//   res.status(404).json({ message: 'MOvie not found' })
// })

// app.post('/movies', (req, res) => {
//   const result = validateMovie(req.body)

//   if (!result.success) {
//     return res.status(400).json({ error: JSON.parse(result.error.message) })
//   }

//   /* const {
//     title,
//     genre,
//     year,                esto se sustituye por la 
//     director,           linea de  const result = validateMovie(req.body)
//     duration,
//     rate,
//     poster
//   } = req.body */

//   const newMovie = {
//     id: crypto.randomUUID(),    // uuid v4
//     ...result.data

//     /* title,
//     genre,            esto se sustituye por
//     year,            ... result.data   ya que esta parseada y validada en el schema movie
//     director,
//     duration,
//     rate: rate ?? 0,
//     poster */
//   }
//   // no seria REST porque estamos guardandoe el estado de la aplicacion en memoria
//   movies.push(newMovie)

//   res.status(201).json(newMovie)  // actualizar la cache del cliente por eso devolvemos el recurso y el 201 es x la nueva creacion 
// })                                // los manejadores de estatus code (http cat pagian para saber que status es cada cosa)

// app.delete('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }

//   const { id } = req.params
//   const movieIndex = movies.findIndex(movie => movie.id === id)

//   if (movieIndex === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }

//   movies.splice(movieIndex, 1)

//   return res.json({ message: 'Movie deleted' })
// })

// app.patch('/movies/:id', (req, res) => {
//   const result = validatePartialMovie(req.body)

//   if (!result.success) {
//     return res.status(400).json({ error: JSON.parse(result.error.message) })
//   }

//   const { id } = req.params   // id pasado por parametro
//   const movieIndex = movies.findIndex(movie => movie.id === id)  // buscar por ese id en todas las peliculas

//   if (movieIndex === -1) {
//     return res.status(404).json({ message: 'Movie not found' })
//   }

//   const updateMovie = {
//     ...movies[movieIndex],
//     ...result.data
//   }

//   movies[movieIndex] = updateMovie

//   return res.json(updateMovie)
// })

// // con el uso del middleware cors ya no se necesita
// /* app.options('/movies/:id', (req, res) => {  // darle las options de cors para los metodos mas complejos
//   const origin = req.header('origin')         //guardado en origin que es lo que pasa el navegador

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {   // este bloque if es para los cors permitidos
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
//   }
//   res.send(200)
// })
//  */
// const PORT = process.env.PORT ?? 1234



// app.listen(PORT, () => {
//   console.log(`server listening on port http://localhost:${PORT}`)
// })