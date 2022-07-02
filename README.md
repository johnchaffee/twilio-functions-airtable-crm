# twilio-functions-airtable-crm

Sample CRM that runs in browser and uses Airtable as a database. Can be embedded in Flex CRMcontainer.

In order to fetch data from Airtable, you must store the following Twilio Function environment variables:

- `AIRTABLE_API_KEY` - Your Airtable API Key
- `AIRTABLE_BASE_ID` - Your Aitable Base ID

## CLI Commands

```shell
# Install the Serverless plugin
$ twilio plugins:install @twilio-labs/plugin-serverless

# List all available commands
twilio serverless --help

# Intialize a new project with the name twilio-serverless-test
$ twilio serverless:init twilio-serverless-test

# Start the local development environment with live reloading of Functions
$ twilio serverless:start

# Run a basic deployment with default settings
$ twilio serverless:deploy

# List the services
$ twilio serverless:list
...

# Delete a service
$ twilio api:serverless:v1:services:remove --sid ZS0179d2a14dd561cb85c5bcb3ae57c21e
```