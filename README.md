////////////////////////////////////////////////////
// HAVE JSON SERVER RUNNING FIRST!
////////////////////////////////////////////////////
// https://codesandbox.io/s/1pxhw?file=/src/api.json
////////////////////////////////////////////////////
####################

## Changelog

####################

#### 8/23.1 (current)

1. I added filter by first letter buttons. Their functionality is to float left characters with the first letter of their name matching. Filter buttons were placed at top left for convience because that's where they float to and your pointer will be nearby to choose which you want.

2. Buttons auto populate when you first load the page, and when you add and delete characters. It keeps in sync. Example if there are no more "A" characters, the A button will disappear.

3. I added a scrollToFocus onto the vote, add, edit buttons to pull the view where it needs to be without user needing to scroll. Possibly in future I will add a cycle left and right buttons hovering the character bar, and a jump to top of screen in the right hand corner.

_Misc._ Truthfully what's less resource intensive than repopulating the buttons as they change would be to hard code the letters that can be used and you hide/shrink buttons with nothing to float outside of view. But that would be less open than the method I did it in you can use any character in any language and the top bar should pull it in.

#### 8/22.3

1. I've added the ability to replace the image with a copy/paste URL during edit

2.......!!!BUG: when I EDIT THEN ADD cuties THEN delete my array becomes offset by that amount added. need to make sure edit properly adjust the array. most likely need to do a return Add-delete-edit-save no change-edit-change picture-save-add-BUG
-FIXed

3.....!!!BUG: check toggle save after edit, does not always change back to edit icon, happens only when you toggle to change pictures and then press save -FIXED

#### 8/22.2

1. BIG UPDATE - added toggle buttons for displaying the vote and add form, moved teh delete key function to a toggle button, and allow users through an edit button to manually edit the amoutn of votes and name.

2. all editted data is displayed realtime to the client without doing unneeded GET request from the dataabase, also teh database is updated to match.

3. I practiced declaring new variables inside an array. so those variables that eslint thinks doesnt exist, do exist.

#### 8/21

1. You can now scroll the top bar by click, hold, and dragging in the blue section below the cuties

2. Removed unnecessary properties and keys from being pushed to JSON when using updateData when changing votes

3. Adjust some margins, padding, and heights in CSS

4. Rearranged some divs in HTML

5. Added a feature to hide addForm on initial load, viewable by pressing +, to keep viewers focused on featuredCharacter on first sight rather than what the text boxes are out of sight. Left it so that it does not hide the addForm after used. Incase user wants to add multiple. Ideally the form would be a modal

6. Added a couple more placeholder pictures and a randomizer to select one of them in place of user providing no image

# Flatacuties

Today you'll be building an app for voting for the cutest animal! You will be
using a local API and building out the frontend for our app, Flatacuties.

## Setup

Run this command to get the backend started:

```sh
json-server --watch db.json
```

Test your server by visiting this route in the browser:

[http://localhost:3000/characters](http://localhost:3000/characters)

Then, open the `index.html` file on your browser to run the application.

Write your code in the `src/index.js` file. The base URL for your API will be
[http://localhost:3000](http://localhost:3000).

## Deliverables

As a user, I can:

1. See all characters names in a `div` with the id of `"character-bar"`. Create
   a `span` tag with the character's name and add it the `div#character-bar`
   once you have retrieved the character data from the server. You will need to
   make a GET request to the following endpoint to retrieve the character data:

   ```txt
   GET /characters

   Example Response:
   [
    {
      "id": 1,
      "name": "Mr. Cute",
      "image": "https://thumbs.gfycat.com/EquatorialIckyCat-max-1mb.gif",
      "votes": 0
    },
    {
      "id": 2,
      "name": "Mr. Monkey",
      "image": "https://thumbs.gfycat.com/FatalInnocentAmericanshorthair-max-1mb.gif",
      "votes": 0
    },
    ...
   ]
   ```

2. When the character in the `div#character-bar` is clicked, display the
   character's details in the `div#detailed-info`. You can either use the
   character information from your first request, or make a new request to this
   endpoint to get the character's details:

   ```txt
   GET /characters/:id

   Example Response:
   {
    "id": 1,
    "name": "Mr. Cute",
    "image": "https://thumbs.gfycat.com/EquatorialIckyCat-max-1mb.gif",
    "votes": 0
   }
   ```

3. When the `form#votes-form` is submitted, add the number of votes from
   the input field to the character displayed in the `div#detailed-info`. **No
   persistence is needed**.

### Bonus Deliverables

These bonus deliverables are here if you want an extra challenge and won't
affect your score. **Make sure to commit your work to save your progress before
attempting the bonus deliverables!**

In the `index.html` file, there is some additional HTML that is currently
commented out below the Reset Votes button. Remove the comments (delete the
`<!--` and `-->` code around the elements) so you can complete the bonus
deliverables.

1. When the Reset Votes button is clicked, reset the votes back to 0.

2. When the `form#character-form` is submitted, add a new character to the
   `div#character-bar`. The new character in the character bar should behave the
   same as the other characters when clicked (its details should be displayed
   below, and it should have functionality to add votes).

3. In addition to adding the character to the `div#character-bar` upon
   submitting the form, the character's details should show up immediately in
   the `div#detailed-info`.

### Extra Bonus

These extra bonus deliverables involve using `fetch` to update data on the
`json-server` backend by using `POST`, `PATCH`, and `DELETE` requests. These are
meant for an extra, extra challenge and won't affect your grade. **Make sure to
commit your work to save your progress before attempting the extra bonus
deliverables!**

1. When a user adds or resets the votes for a character, in addition to
   displaying the updated votes on the page, the votes should **also** be
   updated on the server. You will need to make a request that follows this
   structure:

   ```txt
   PATCH /characters/:id

   Request Headers: {
     Content-Type: application/json
   }

   Request Body: {
     "votes": 100
   }
   ----

   Example Response: {
     "id": 1,
     "name": "Mr. Cute",
     "image": "https://thumbs.gfycat.com/EquatorialIckyCat-max-1mb.gif",
     "votes": 100
   }
   ```

2. When a user adds a new character to the page using the character form, in
   addition to having the character show up on the page, it should **also** be
   saved to the server. You will need to make a request that follows this
   structure:

   ```txt
   POST /characters

   Request Headers: {
     Content-Type: application/json
   }

   Request Body: {
     "name": "Character Name",
     "image": "https://example.com/my-image.gif",
     "votes": 0
   }

   ----

   Example Response: {
     "id": 6,
     "name": "Character Name",
     "image": "https://example.com/my-image.gif",
     "votes": 0
   }
   ```
