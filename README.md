# meister-task-sync

Script for syncing Evernote reminders to ideas in MindMeister maps and tasks in Meister Tasks.

## Installation

### Prerequisites

* [Node.js](http://nodejs.org/) version 6.2.2 or higher

### Installation

```
npm install
```

After installing, create a file *credentials.json* in the project's root dir that contains your API key,
like this:

```
{
  "key": "API-KEY",
  "secret": "API-SECRET",
  "user": "USERNAME",
  "password": "PASSWORD"
}
```

(obviously, you replace the values with actual key, secret, user, password)

## Running the Script

```
npm start
```



