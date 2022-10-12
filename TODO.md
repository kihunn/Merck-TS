# Server
- [x] Implement printing using node-brother-lable-printer library
- [x] Generate qr code keys using a seeded or consistent hash algorithm
- [x] Generate qr codes and be able to send them to front-end

# Client
- [x] Button to edit a sample in table format
    - [ ] Have a log somewhere that shows who edited what and when
- [ ] Clean up styles, remove unused styles and make website look better
- [ ] Create different pages for (below) using react-router & react-router-dom. On top of this need to set up a router to redirect qr codes when scanned:
    - Sample viewing
    - Sample creating
    - Edit log
    - QR Code scanning
- [x] Fix default value for textfields that are supposed to have dates
- [ ] MUI styles works sometimes and sometimes they dont -> could be because no theme is declared?
- [x] Plan for edit button functionality
    - When edit button is clicked, switch out the text in the table cell with a text field and change the edit icon to a checkmark and add an x next to it
- [ ] Use luxon to format dates properlly
- [ ] Make it so you cant create a sample that has the same properties as an existing one
    - if new_qr_code_key == existing_qr_code_key dont create that new sample
- [ ] Add the ability to scan a qr code using scanner

# Label Management
- Labels are generated once upon request and cached
- Labels will be re-generated when edited
- If we get the same label twice just generate once then return cached base64 string or img obj
