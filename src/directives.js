import Vue from 'vue/dist/vue.js';

Vue.directive('numericOnly', {
    bind(el) {
      el.addEventListener('keyup', () => {
        let regex = /^[0-9]*$/
        console.log("WORKING--->");
        if (!regex.test(el.value)) {
          el.value = el.value.slice(0, -1)
        }
      })
    }
  })