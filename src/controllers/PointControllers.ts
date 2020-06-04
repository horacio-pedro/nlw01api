import {Request, Response} from 'express'
import knex from '../database/connection'

class PointsController {
	async index(req: Request, res: Response) {
		const { city, uf, items } = req.query

		const parsedItem = String(items)
			.split(',')
			.map(item => Number(item.trim()))

		const points = await knex('points')
			.join('point_itms', 'points.id', '=', 'point_itms.point_id')
			.whereIn('point_itms.item_id', parsedItem)
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()
			.select('points.*')

		return res.json(points)
	}

	async show(req: Request, res: Response) {
		const { id } = req.params

		const point = await knex('points').where('id', id).first()

		if (!point) {
			return res.status(400).json({ message: 'Point not found' })
		}

		const items = await knex('items')
			.join('point_itms', 'items.id', '=', 'point_itms.item_id')
			.where('point_itms.point_id', id)
			.select('items.title')

		return res.json({ point, items })
	}

	async create(request: Request, response: Response) {
		const {
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
			items
		} = request.body

		const trx = await knex.transaction()

		const point = {
			image: 'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
			name,
			email,
			whatsapp,
			latitude,
			longitude,
			city,
			uf,
		}

		const insertedIds = await trx('points').insert(point)

		const point_id = insertedIds[0]

		const pointItems = items.map((item_id: Number) => {
			return {
				item_id,
				point_id,
			}
		})

		await trx('point_itms').insert(pointItems)

		await trx.commit()

		return response.json({
			id: point_id,
			...point,
		})
	}

}

export default PointsController
