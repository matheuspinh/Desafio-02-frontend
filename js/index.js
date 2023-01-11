const root = document.querySelector(":root");
const moviesContainer = document.querySelector(".movies")
let moviesPage = 1
const maxPage = 3
const minPage = 1
const today = '436969'
let movies
const nxtBtn = document.querySelector(".btn-next")
const prevBtn = document.querySelector(".btn-prev")
const searchInput = document.querySelector(".input")
const modal = document.querySelector(".modal")
const closeModalBtn = document.querySelector(".modal__close")
let lightTheme = true;
const toggleThemeBtn = document.querySelector(".btn-theme")
const logo = document.querySelector(".logo")

toggleThemeBtn.addEventListener('click', (e) => {
  if (lightTheme) {
    toggleThemeBtn.src = './assets/dark-mode.svg'
    root.style.setProperty('--background', "#1B2028")
    root.style.setProperty('--input-color', "#665F5F")
    root.style.setProperty('--text-color', "#ffffff")
    root.style.setProperty('--input-background', "#2D3440")
    root.style.setProperty('--bg-secondary', "#2D3440")
    root.style.setProperty('--bg-modal', "#2D3440")
    closeModalBtn.src = './assets/close.svg'
    logo.src = './assets/logo.svg'
    nxtBtn.src = './assets/arrow-right-light.svg'
    prevBtn.src = './assets/arrow-left-light.svg'
    lightTheme = false
    return
  }
  toggleThemeBtn.src = './assets/light-mode.svg'
  root.style.setProperty('--background', "#fff")
  root.style.setProperty('--input-color', "#979797")
  root.style.setProperty('--text-color', "#1b2028")
  root.style.setProperty('--input-background', "#fff")
  root.style.setProperty('--bg-secondary', "#ededed")
  root.style.setProperty('--bg-modal', "#ededed")
  closeModalBtn.src = './assets/close-dark.svg'
  logo.src = './assets/logo-dark.png'
  nxtBtn.src = './assets/arrow-right-dark.svg'
  prevBtn.src = './assets/arrow-left-dark.svg'
  lightTheme = true
})

closeModalBtn.addEventListener('click', (e) => {
  modal.classList.add('hidden')
})

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    let query = searchInput.value
    getMovies(query)
    searchInput.value = ''
  }
})

nxtBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  moviesPage++
  if (moviesPage > maxPage) {
    moviesPage = 1;
  }
  populateMovies(movies);
})

prevBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  moviesPage--
  if (moviesPage < minPage) {
    moviesPage = 3;
  }
  populateMovies(movies);
})

async function openMovie(id) {
  try {
    const response = await api.get(`movie/${id}?language=pt-BR`)
    const movieDetail = response.data
    const genres = movieDetail.genres
    modal.classList.remove('hidden')

    const modalTitle = document.querySelector('.modal__title')
    const modalImg = document.querySelector('.modal__img')
    const modalDescription = document.querySelector('.modal__description')
    const modalAverage = document.querySelector('.modal__average')
    const modalGenres = document.querySelector('.modal__genres')
    modalGenres.innerHTML = ''

    modalTitle.textContent = movieDetail.title
    modalImg.src = `${movieDetail.backdrop_path}`
    modalDescription.textContent = movieDetail.overview
    modalAverage.textContent = (movieDetail.vote_average).toFixed(2)

    for (let genre of genres) {
      const text = genre.name
      const element = document.createElement('span')
      element.classList.add('modal__genre')
      element.textContent = text
      modalGenres.appendChild(element)
    }

    return
  } catch (error) {

  }
}

function populateMovies(movies) {
  moviesContainer.innerHTML = ''
  const moviesCountEnd = 6 * moviesPage
  const moviesStartCount = 6 * (moviesPage - 1)
  for (let i = moviesStartCount; i < moviesCountEnd; i++) {
    const movie = document.createElement('div')
    movie.classList.add('movie')
    movie.style.backgroundImage = `url("${movies[i].poster_path}")`
    const info = document.createElement('div')
    info.classList.add('movie__info')
    const title = document.createElement('span')
    title.classList.add('movie__title')
    title.textContent = movies[i].title
    const rating = document.createElement('span')
    rating.classList.add('movie__rating')
    rating.textContent = (movies[i].vote_average).toFixed(2)
    const star = document.createElement('img')
    star.src = './assets/estrela.svg'
    star.alt = "Estrela"

    movie.appendChild(info)
    info.appendChild(title)
    info.appendChild(rating)
    rating.appendChild(star)
    moviesContainer.appendChild(movie)

    movie.addEventListener('click', (e) => { openMovie(movies[i].id) })
  }
}

async function todaysMovie(today) {
  try {
    const detailResponse = await api.get(`/movie/${today}?language=pt-BR`)
    const videoResponse = await api.get(`/movie/${today}/videos?language=pt-BR`)
    const todayMovieDetail = detailResponse.data
    const todayMovieVideo = videoResponse.data.results

    const highlightVideo = document.querySelector('.highlight__video')
    const highlightTitle = document.querySelector('.highlight__title')
    const highlightRating = document.querySelector('.highlight__rating')
    const highlightGenres = document.querySelector('.highlight__genres')
    const hightlightLaunch = document.querySelector('.highlight__launch')
    const hightlightDescription = document.querySelector('.highlight__description')
    const hightlightVideoLink = document.querySelector('.highlight__video-link')
    let genres = ((todayMovieDetail.genres).map((item) => {
      return item.name
    })).join(', ')

    let date = todayMovieDetail.release_date
    let releaseDate = formatDate(date)

    highlightVideo.style.backgroundImage = `url("${todayMovieDetail.backdrop_path}")`
    highlightTitle.textContent = todayMovieDetail.title
    highlightRating.textContent = (todayMovieDetail.vote_average).toFixed(2)
    highlightGenres.textContent = genres
    hightlightLaunch.textContent = releaseDate
    hightlightDescription.textContent = todayMovieDetail.overview
    hightlightVideoLink.setAttribute('href', `https://www.youtube.com/watch?v=${todayMovieVideo[0].key}`)

  } catch (err) {

  }
}

async function getMovies(query) {
  if (query) {
    try {
      const response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${query}`)
      movies = response.data.results
      populateMovies(movies)
      return
    } catch (err) {

    }
  } else {
    try {
      const response = await api.get('/discover/movie?language=pt-BR&include_adult=false')
      movies = response.data.results
      populateMovies(movies)
      return
    } catch (err) {
    }
  }
}

const formatDate = (date) => {
  let ms = Date.parse(date)
  date = new Date(ms)
  const options = { month: "long", year: "numeric", day: "numeric", timeZone: "UTC" }
  return (date.toLocaleDateString("pt-BR", options))
}



todaysMovie(today)
getMovies()