# Specs for the Nation3 mobile passport

We can use [Apple Wallet](https://developer.apple.com/wallet/)/[Google Pay](https://developers.google.com/pay/passes) to create passes representing Nation3 passports.
Thanks to those platforms, we can enable citizens to:

- Keep track of everything Nation3, by sending them push notifications
- Identify themselves as Nation3 citizens at in-person events
- Get notified if they are close to a Nation3 embassy
- Feel really cool about carrying around their passport 😎

## Pass template

- Design containing the core elements that make up the pass. Example here:
- Contains the following variable items:
  - Passport ID, corresponding to the NFT
  - Passport holder, corresponding to the address owning the passport

## Pass server

- Enables the citizen to download their pass, if identified by:
  - Asking for their wallet's signature
  - Checking it they hold a passport NFT
- Pushes updates to the template to the citizen's device
- Pushes push notifications to the citizen's device

## API

- `/api/downloadPass?address=0xabc&signature=0xabc`: Takes `address` and `signature` as parameters, check that the address has a passport NFT and that the signature is valid. Populates the pass template with the passport ID and passport holder, serves the pass download to the user.

### Protected endpoints

Protected by authentication so it can only be called by the designated staff.

- `/api/pushUpdate`: Pushes an update to the passes, usually by updating the template. Would require first pushing the new passport template files to the repo.
- `/api/pushNotification?title=Title&content=Text`: Pushes a notification to all citizens with `title` and `content`.

## Abstractions

We should create a `Passes` class with the following methods:

- `downloadPass(passportID, platform)`: Triggers a download of a pass for a given passport ID and platform (currently Apple or Google).
- `pushUpdate(newPassTemplate)`: Pushes an updated template to all the passes.
- `pushNotification({title, content})`: Pushes a notification to all the passes.

It's important to create this abstraction so that we can add new pass platforms in the future. Not everyone is into the Apple or Google ecosystem, so this is important.

## QR codes and signatures

Every pass can have a QR code. This QR code can be very useful so citizens can identify themselves at in-person events. More coming soon...
