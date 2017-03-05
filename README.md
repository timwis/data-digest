# subscribeme
Monitors an API for new data and sends digest emails to subscribers.

## Schema
### services
| service_id | name | slug | endpoint | template |

### queries
| query_id | service_id | query |

### subscribers
| subscriber_id | query_id | email | confirmed |
