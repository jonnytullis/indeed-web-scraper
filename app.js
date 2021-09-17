const axios = require('axios')
const HTMLParser = require('node-html-parser')
const { decode } = require('html-entities')

const companySearchName = 'apple'
const jobPosition = 'software engineer'

const url = `https://www.indeed.com/jobs?q=${encodeURI(jobPosition)}%20company%3A${encodeURI(companySearchName)}`

async function fetchData() {
  const results = []

  const res = await axios.get(url)
  const root = HTMLParser.parse(res.data)

  const jobListContainer = root.querySelector('#mosaic-zone-jobcards')

  if (jobListContainer) {
    const cards = jobListContainer.querySelectorAll('.slider_item')

    cards?.forEach((card) => {
      const result = { title: '', companyName: '', location: '', description: '' }

      result.title = card.querySelector('.jobTitle > span')?.innerText
      result.description = card.querySelector('.job-snippet')?.innerText?.trim()?.replace('\n', '')

      const companyHTML = String(card.querySelector('.company_location > pre')?.innerText)
      const companyRoot = HTMLParser.parse(companyHTML)

      result.companyName = companyRoot.querySelector('.companyName')?.innerText
      result.location = companyRoot.querySelector('.companyLocation')?.innerText

      result.title = decode(result.title)
      result.companyName = decode(result.companyName)
      result.location = decode(result.location)
      result.description = decode(result.description)

      results.push(result)
    })

    results.forEach(result => {
      console.log('Job Title:', result.title)
      console.log('Company:', result.companyName)
      console.log('Location:', result.location)
      console.log('Job Description:', result.description)
      console.log('\n--------------------------------------------\n')
    })
  } else {
    console.log(`No "${jobPosition}" positions were found for the company "${companySearchName}"`)
  }
}

fetchData()
