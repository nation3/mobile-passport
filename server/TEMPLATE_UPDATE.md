# Template Update

This document explains, step-by-step, how to update the template of a pass.

## Apple Templates

1. Copy the the current template version to a new folder, e.g. `cp -r template-versions/apple/2 template-versions/apple/3`
1. Commit the changes
1. Make your changes in the new folder
1. Commit the changes
1. Increase the `appleTemplateVersion` in `utils/Config.ts`
1. Test that the new pass is successfully generated by making a `[GET]` request to `http://localhost:3000/api/downloadPass` (see full request example in `cypress/e2e/api/apple/downloadPass.cy.ts`)
1. Test that it works to open the generated `.pkpass` file on an iOS device
1. Commit the changes
1. Publish the updated pass template by pushing a new "latest update" notification: [PUSH_NOTIFICATION.md](PUSH_NOTIFICATION.md)

## Google Templates

`// TO DO`
