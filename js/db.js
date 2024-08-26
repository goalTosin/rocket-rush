const DB = {
  get hasShownStory() {
    let raw = localStorage.getItem('hasShownStory')
    if (raw) {
      return JSON.parse(raw)
    }
    return false
  },
  set hasShownStory(val) {
    localStorage.setItem('hasShownStory', JSON.stringify(val))
  }
}

export default DB