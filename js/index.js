Vue.component('card-component', {
  template: '#cardComponentTemplate',
  props: {
    details: {},
    starIcon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    pm_color(num) {
      let card_bgc = ''
      if(num == '' || num == 'ND') {
        card_bgc = 'aqi-5'
      }
      else if(num < 15.4) {
        card_bgc = 'aqi-1'
      }
      else if(15.5 <= num && num < 35.4) {
        card_bgc = 'aqi-2'
      }
      else if(35.5 <= num && num < 54.4) {
        card_bgc = 'aqi-3'
      }
      else if(54.5 <= num && num < 150.4) {
        card_bgc = 'aqi-4'
      }
      return card_bgc
    }
  }
})

new Vue({
  el: '#app',
  data: {
      data: [],
      selected: '',
      like_data: JSON.parse(localStorage.getItem('data')) || [],
      update: []
  },
  methods: {
    get_data() {
      const vm = this
      const cors = 'https://cors-anywhere.herokuapp.com/'
      const api = 'http://opendata2.epa.gov.tw/AQI.json'
      axios.get(cors+api).then(res => {
        vm.data = res.data
        vm.update.splice(0, vm.update.length)
        res.data.forEach(item => {
          vm.like_data.forEach(i => {
            if(item.SiteName === i) {
              vm.update.push(item)
            }
          })
        })
      })
    },
    add_like(target) {
      const vm = this
      let search_repeat = vm.like_data.indexOf(target.SiteName)
      if(search_repeat === -1) {
        vm.like_data.push(target.SiteName)
      }
      localStorage.setItem('data', JSON.stringify(vm.like_data))
      vm.update.push(target)
      // vm.get_data()
    },
    del_like(target) {
      const vm = this
      vm.like_data.forEach((item, index) => {
        if(item === target.SiteName){
          vm.like_data.splice(index, 1)
        }
      })
      localStorage.setItem('data', JSON.stringify(vm.like_data))
      vm.update.forEach((item, index) => {
        if(item === target){
          vm.update.splice(index, 1)
        }
      })
      // vm.get_data()
    },
    redload() {
      const vm = this
      vm.selected = ''
    }
  },
  computed: {
    filter_county() {
      const vm = this
      const moment = []
      vm.data.forEach(item => {
        moment.push(item.County)
      })
      return Array.from(new Set(moment))
    },
    filter_data() {
      const vm = this
      const select_county = []
      vm.data.forEach((item, index) => {
        if(item.County === vm.selected) {
          select_county.push(vm.data[index])
        }
      })
      return select_county
    }
  },
  created() {
    const vm = this
    vm.get_data()
  }
})