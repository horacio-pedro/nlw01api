import express from 'express'

const app = express()

app.get('/users', (request, response) => {
	console.log('Listagem de usuários')

	response.json([
		'Horácio',
		'Miguel',
		'Sucesso',
	])
})

app.listen(2000)