# Payload Plugin Editing Check

* This plugin is still under development. PR's are welcomed.

This plugin adds a field to your collections that blocks someone of editing the content if that ID is already being edited by someone else.

It uses the PartyKit library to create websocket connections with a room for each slug and ID so that the editing can be reenabled after whoever was editing finishes it.

## Installation

### Install the package

```
yarn add @divbrands/payload-plugin-editing-check
```

### Configure PartyKit server

Create a `partykit.json` file in the root of your project with the following contents:

```
{
  "name": "payload-editing-check-party",
  "main": "./node_modules/@divbrands/payload-plugin-editing-check/dist/server/partykit.js",
  "compatibilityDate": "2023-10-06"
}
```

This will ensure that the deployed server works with the plugin.

You can change the name of the party as you want.

### Create the server

Run this command where the `partykit.json` file resides:

```
npx partykit deploy
```

It will first ask to create your login if you don't have it yet. 
Then grab the URL of the server on the command line and add to your ```.env``` file:

```
PAYLOAD_PUBLIC_PARTY_URL=name-of-your-party-and-server
```

You can find more info if needed at: [https://docs.partykit.io/](https://docs.partykit.io/)

### Configure Payload CMS

Add the plugin to your configuration:

```js
import { buildConfig } from 'payload/config';
import { editingCheck } from "@divbrands/payload-plugin-editing-check"

const config = buildConfig({
  collections: ['examples', 'users'],
  plugins: [
    editingCheck({
      enabled: true,
      except: ['users'],
      partyUrl: process.env.PAYLOAD_PUBLIC_PARTY_URL
    }),
  ],
});

export default config;
```

#### Options
- `enabled`: Boolean
 
  If you want the plugin enabled or not.

- `except`: string[] | null

  You can choose the collections that you don't want the plugin to apply.

- `partyUrl`: string

  The URL provided by deploying Party Kit with `npx partykit deploy`.
  It has to be public if it comes from `.env` file.


### Enjoy

And that's it! You can try opening a few tabs wih and ID of a collection and seeing the modal appear. It will block any editing of the content for that specific ID.

When you close the tab that was actually editing the content, another one should reload and now be able to edit.

The tab will reload so that it gets the updated content from last edit.