# Push Notifications

Apple does not automatically fetch updated passes, so we need to push a notification to the device first.

These are the steps for pushing a notification to registered passes:

1. Add a "latest update" as a new table row in Supabase: 
   - Go to the table editor in Supabase (Nation3 → passports- Add a "latest update" as a new table row
   - Select the `latest_updates` table
   - Click "Insert row"
   - Type a title and content. These two values will appear at the back of the passes
   - Press "Save"
1. Push the latest update to registered passes:
   - Go to https://passports.nation3.org/api/pushLastUpdate
   - Type the username and password
   - Expect this confirmation message:
      ```json
      {
          "summary": "1 sent, 3 failed",
          "sent": [ ... ],
          "failed": [ ... ]
      }
      ``` 
   - Wait a few seconds, and the updates passes (and a push notification) should appear on the iOS device of each citizen

## FAQ 

1. How do I publish a new template version for a pass?
   - See [TEMPLATE_UPDATE.md](TEMPLATE_UPDATE.md)
1. If I only want to update the pass template, do I still need to publish a "latest update"?
   - Yes, because the timestamp of the most recent latest update is what triggers the download of updated pass templates.
1. Can I create a new "latest update" using the website?
   - Not yet. For now, these are added manually to the Supabase database. But later we will make it easier to add these using the website.
1. I already downloaded my pass a few months ago? Will it receive updates from Nation3?
   - Only passes downloaded after September 1st are updatable. If you downloaded your pass before this date, please go to https://app.nation3.org/citizen and download the new version.
      > <img width="480" src="https://user-images.githubusercontent.com/95955389/190090203-954075d3-4854-4039-882b-63893396c068.png">
