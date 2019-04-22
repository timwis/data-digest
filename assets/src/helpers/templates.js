import { stripIndent, oneLineTrim } from 'common-tags'
import formatDate from 'date-fns/format'
import subDays from 'date-fns/sub_days'

export const defaultSubjectTemplate = () => stripIndent`
  You have {{data.items.length}} listings today
`

export const defaultBodyTemplate = () => stripIndent`
  {{#if data.rows.length}}
    <h1>Your daily listings</h1>
    <ul>
    {{#each data.items}}
      <li>{{title}}</li>
    {{/each}}
  {{/if}}
`

export const exampleSampleUrl = () => {
  const yesterday = formatDate(subDays(new Date(), 1), 'YYYY-MM-DD')
  return oneLineTrim`
    https://api.github.com/search/repositories
    ?q=created:>=${yesterday} language:javascript
    &sort=stars
    &order=desc
  `
}

export const exampleSubjectTemplate = () => stripIndent`
  {{data.items.length}} new JavaScript repos
`

export const exampleBodyTemplate = () => stripIndent`
  {{#if data.items.length}}
    <h1>New JavaScript repos</h1>
    <ul>
    {{#each data.items}}
      <li>
        <a href="{{html_url}}">{{name}}</a>
        ({{stargazers_count}} stars)
      </li>
    {{/each}}
    </ul>
  {{/if}}
`
