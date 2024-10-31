function buttonClicked(){    
    
    var city = document.getElementById("city_input").value

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=32804b24a847407391c53709241010&q=${city}`)
    .then((response) => response.json())
    .then((data) => {
        
        console.log(data) 
        console.log(data.current.temp_c)  
        console.log(`Temperature in ${data.name} is ${data.current.temp_c} Celcius`)

        document.getElementById("demo1").innerHTML = `Temperature in ${data.name} is ${data.current.temp_c} Celcius`

    } )  
}