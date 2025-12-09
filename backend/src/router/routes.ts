import { Router } from 'express'
import { root } from './rootController'

const router: Router = Router()

router.get('/', root)

export default router