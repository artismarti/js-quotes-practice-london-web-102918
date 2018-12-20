const quotesURL = 'http://127.0.0.1:3000/quotes'
const quoteListUl = document.getElementById('quote-list')
const newQuoteForm = document.getElementById('new-quote-form')
const newQuoteText = document.getElementById('new-quote')
const newQuoteAuthor = document.getElementById('author')

// fetchQuotes
const fetchQuotes = () =>{
  fetch(quotesURL)
    .then(response => response.json())
    .then((quotes) => renderAllQuotes(quotes))
}

// renderAllQuotes
const renderAllQuotes = (quotes) => {
  quotes.forEach((quote) => {
    renderSingleQuote(quote)
  })
}
// renderSingleQuote
const renderSingleQuote = (quote) => {
  const likeBtn = document.createElement('button')
  const deleteBtn = document.createElement('button')
  const quoteListLi = document.createElement('li')
  quoteListLi.dataset.quoteId = quote.id
  quoteListLi.className = 'quote-card'
  likeBtn.id = `like-${quote.id}`
  likeBtn.className = 'btn-success'
  likeBtn.innerHTML = `Likes: <span>${quote.likes}</span>`
  deleteBtn.id = `delete-${quote.id}`
  deleteBtn.className = 'btn-danger'
  deleteBtn.innerText = 'Delete'

  quoteListLi.innerHTML += `
      <blockquote class="blockquote">
      <p contenteditable class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
    </blockquote>
  `

  likeBtn.addEventListener('click', (event) => likeQuote(event, quote))
  deleteBtn.addEventListener('click', (event) => deleteQuote(event, quote))
  let pTag = quoteListLi.querySelector('.mb-0')
  quoteListLi.addEventListener('blur', () => editQuote(quote, pTag))
  quoteListLi.appendChild(likeBtn)
  quoteListLi.appendChild(deleteBtn)
  quoteListUl.appendChild(quoteListLi)
}
const editQuote = (quote, pTag) => {
  console.log(pTag.innerText);
  fetch(`${quotesURL}/${quote.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: pTag.innerText
    })
  })
}
// addQuote
const likeQuote = (event, quote) => {
  let quoteLikes = ++quote.likes
  fetch(`${quotesURL}/${quote.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      likes: quoteLikes
    })
  })
    .then(response => response.json())
    .then((updatedQuote) => {
      event.target.innerHTML = `Likes: <span>${updatedQuote.likes}</span>`
    })
}

const deleteQuote = (event, quote) => {
  fetch(`${quotesURL}/${quote.id}`, {
    method: 'DELETE'
  })
  let deleteQuoteLi = quoteListUl.querySelector(`li[data-quote-id="${quote.id}"]`)
  deleteQuoteLi.remove()
}

const addNewQuote = (event) => {
  event.preventDefault()
  fetch(quotesURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuoteText.value,
      likes: 0,
      author: newQuoteAuthor.value
    })
  })
    .then(response => response.json())
    .then((quote) => {
      renderSingleQuote(quote)
      newQuoteForm.reset()
    })
}
fetchQuotes()
newQuoteForm.addEventListener(('submit'), addNewQuote)
