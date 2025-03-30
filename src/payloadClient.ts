import { getPayload } from 'payload'
import config from '@/payload.config'

const payloadConfig = await config
const payload = await getPayload({ config: payloadConfig })

export default payload
