const app = new Vue({
    el: '#app',    
    data () {
        return {
          data: null,
          title: 'COVID-19 ARGENTINA',     
          deaths: null,   
          cases: null, 
          date: null,
        }
    },
    mounted () {
        axios
            .get('https://sheets.googleapis.com/v4/spreadsheets/1Y8LdNga5qPRwQmjOJw1SBNVdFzxoZTSwxAW5pTLme9Q/values/COVID-19 ARG Total Prov?key=AIzaSyDQe2kWZc_I8-rmBQbmQmRUTmlZ1qillXw')
            .then(response => (this.data = response.data,
                
                this.deaths = this.data.values[25][2],
                this.cases = this.data.values[25][1],
                this.date = Date(),

                this.data.values.forEach(element => {
                    
                    // ADDING TOOLTIP
                    tippy('#AR-' + element[3], {
                        content: element[0] + ' | Casos: ' + element[1] + ' | Muertes: ' + element[2],
                        duration: [100, 200],
                    })   
                    
                    try{
                        // ADDING COLOR CLASS
                        if(element[1] > 50){
                            this.$refs["" + element[3]].classList.add('high')
                        }
                        else if(element[1] > 10){
                            this.$refs["" + element[3]].classList.add('medium') 
                        }
                        else if(element[1] > 1){
                            this.$refs["" + element[3]].classList.add('low') 
                        }
                        else if(element[1] > 0){
                            this.$refs["" + element[3]].classList.add('very-low') 
                        }
                    }
                    catch{

                    }
                    
                })
                
                // this.$refs.progress.classList.add('hide')
            ))
    },
})