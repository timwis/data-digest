import { stripIndent, oneLineTrim } from 'common-tags'
import formatDate from 'date-fns/format'
import subDays from 'date-fns/sub_days'

export const exampleEndpointTemplate = () => {
  const yesterday = formatDate(subDays(new Date(), 1), 'YYYY-MM-DD')
  return oneLineTrim`
    https://api.github.com/search/repositories
    ?q=created:>=${yesterday} language:javascript
    &sort=stars
    &order=desc
  `
}

export const exampleSubjectTemplate = () => stripIndent`
  {{data.items.size}} new JavaScript repos
`

export const exampleBodyTemplate = () => stripIndent`
  {% if data.items.size > 0 %}
    <h1>New JavaScript repos</h1>
    <ul>
    {% for item in data.items %}
      <li>
        <a href="{{item.html_url}}">{{item.name}}</a>
        ({{item.stargazers_count}} stars)
      </li>
    {% endfor %}
    </ul>
    <a href="{{unsubscribe_url}}">Unsubscribe</a>
  {% endif %}
`
