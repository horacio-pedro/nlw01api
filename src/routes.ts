import { Router } from 'express'
import knex from './database/connection'
import PointsController from './controllers/PointControllers'
import ItemsController from './controllers/ItemsControllers'

const router = Router()
const itemControllers = new ItemsController()
const pointControllers = new PointsController()

router.get('/items', itemControllers.index)

router.get('/points', pointControllers.index)
router.post('/points', pointControllers.create)
router.get('/points/:id', pointControllers.show)

export default router
