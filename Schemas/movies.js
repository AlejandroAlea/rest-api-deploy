const z = require('zod')

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required.'
  }),
  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  )
})

function validateMovie (input) {
  return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input)
}

module.exports = {
  validateMovie,
  validatePartialMovie
}



// // solo para validar los datos de las movie

// const z = require('zod') //importar el zod para utilizarlo al validar los campos

// const movieSchema = z.object({   // la validacion de cada campo
//   title: z.string({
//     invalid_type_error: 'Movie title must be a string',
//     required_error: 'Movie title is required'
//   }),
//   year: z.number().int().min(1900).max(2024),
//   director: z.string(),
//   duration: z.number().int().positive(),
//   rate: z.number().min(0).max(10).default(0),
//   poster: z.string().url({
//     message: 'Poster must be a valid URL'
//   }),
//   genre: z.array(
//     z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Crime', 'Scri-Fi']),
//     // se puede hacer alreves z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Scri-Fi']).array()
//     {
//       required_error: 'Movie genre is required',
//       invalid_type_error: 'Movie genre must be an array of enum Genre'
//     }
//   )
// })

// function validateMovie(object) {  // el objeto validado
//   return movieSchema.safeParse(object)  // parsear para obtener los errores
// }

// function validatePartialMovie(object) {
//   return movieSchema.partial().safeParse(object) // .partial() reaprovechamos movieSchema que estan validadas todas las propiedades pero con partial coge y valida solo las que pases da opcion de coger de las ya validadas
// }

// module.exports = {  //exportar la validacion para usarlo en el method POST
//   validateMovie,
//   validatePartialMovie
// }