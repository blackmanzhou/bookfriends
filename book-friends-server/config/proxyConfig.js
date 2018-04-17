module.exports = {
  proxyBaseUrl: 'http://localhost:3003/bookcircle',
  getRecommendBookUrl () {
    return this.proxyBaseUrl + '/book/recommend'
  },
  getBookInfoByISBN () {
    return this.proxyBaseUrl + '/book/querybyisbn'
  }
}
