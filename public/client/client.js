document.getElementById('fetch-weather-button').addEventListener('click', async () => {
  const response = await window.PacketPay('http://localhost:3000/weatherStats', {
    method: 'POST'
  })
  const dataObj = response.body
  const data = new TextDecoder().decode(response.body)
  console.log('dataObj:', dataObj)
  console.log('dataStr:', data)
  document.getElementById('weather-data').innerHTML = JSON.stringify(JSON.parse(data).weather)
})
