document.getElementById('fetch-weather-button').addEventListener('click', async () => {
  const response = await window.PacketPay('http://localhost:3000/weatherStats', {
    method: 'POST'
  })
  const dataObj = response.body
  const dataStr = dataObj.toString('utf8')
  console.log('dataObj:', dataObj)
  console.log('dataStr:', dataStr)
  document.getElementById('weather-data').innerHTML = dataStr
})
