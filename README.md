## Swissmedhealth

Customizations for app.swissmedhealth.com

#### License

MIT

### How to migrate lead doctype
After migration.
```
bench console
from swissmedhealth.swissmedhealth.hooks.lead import migrate_from_lead
migrate_from_lead()
```