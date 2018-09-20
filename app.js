require('dotenv').load()
const axios = require('axios')
const cheerio = require('cheerio')


const LeanResponse = (html, config) => {
    let $ = cheerio.load(html)
    return $(config.title).map((_, element) => config.returnResponse($, element)).get()
}

const SearchNoticies = async (LeanResponse, config) => {
    try {
        const response = await axios({ url: config.url, method: 'get' })
        const objectReturn = await LeanResponse(response.data, config)
        return Promise.resolve(objectReturn)
    } catch (err) {
        return Promise.reject(err)
    }
}

const config = {
    title: '.post-title',
    body: 'a',
    attr: 'href',
    url:  process.env.IMASTER_NOTICIES,
    returnResponse: ($, element) => ({
        title: $(element).find(config.body).text(),
        url: $(element).find(config.body).attr(config.attr)
    })
}

// const config = {
//     title: '.news_type_block',
//     body: 'h2',
//     option: 'a',
//     attr: 'href',
//     url:  process.env.INFOQ_NOTICIES,
//     returnResponse: ($, element) => ({
//         title: $(element).find(config.body).text().trim(),
//         url: $(element).find(config.body).find(config.option).attr(config.attr)
//     })
// }

SearchNoticies(LeanResponse, config)
    .then(resp => console.log('response', resp))
    .catch(err => console.log('error', err))