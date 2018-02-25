import { stringify } from 'query-string'
import { oneLineTrim } from 'common-tags'

const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN
const AUTH0_CALLBACK_URL = process.env.AUTH0_CALLBACK_URL

export default function initiateLogin ({ redirect }) {
  if (typeof window === 'undefined') return

  const query = (redirect) ? `?redirect=${redirect}` : ''
  const loginParams = {
    response_type: 'code',
    scope: 'openid profile',
    client_id: AUTH0_CLIENT_ID,
    redirect_uri: AUTH0_CALLBACK_URL + query
  }

  const url = oneLineTrim`
    https://${AUTH0_DOMAIN}/authorize
    ?${stringify(loginParams)}
  `
  window.location.href = url
}
