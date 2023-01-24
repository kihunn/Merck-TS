# Highest Priority Tasks
- [x] Merge everyone's pull requests from local branches to get final combined solution
- [ ] Finish Terri's requests for Pharmeceutical Team **(this is a must have before presentation)**
    - [x] Add a page to the frontend specifically for the Pharmeceutical Team that has MK, Sample Name, ELN Notebook Number, and Date
          - [x] How are we displaying samples for the Pharmeceutical Team - Are they on their own view samples page or the same view samples page and if so do we have the ability to filter to get only samples associated with pharmeceutical team?
    - [x] Add table in database specifically for the Pharmeceutical Team
    - [ ] Make sure QR code scanning feautre that is present on the frontend works on multiple devices and can communicate with printer as well **(would be nice to be able to demo this in final presentation)**   
    - [x] Finish Audit Trail feature *(I think this is already done)

# ToDo's From Jonathan
- [ ] Get confirmation message ("sample successfully updated") on frontend when you edit a sample
- [x] Have edits show up automatically without manually having to refresh page
- [ ] Get confirmation message ("sample successfully created") on frontend when you create a new sample
- [ ] Add comment field for sample to database and frontend
    - [ ] Text field for scientists to add any additional information
- [x] Make expired labels appear RED in View Samples page on Frontend
    - [ ] Sample is expired when current_date > expiration_date
- [x] Add a filter button to the View Samples page on Frontend to show only expired samples
- [~] Add option to discard sample in View Samples page on Frontend
    - [ ] Discarding sample removes from table in View Samples
    - [ ] DO NOT delete from database
    - [ ] Add a variable in database indicating that sample is discarded
    - [ ] Should not be able to print discarded samples
    - [ ] Don't make any changes ot database - just don't send to View Samples page
- [ ] Ability to view discarded samples on Frontend
    - [ ] Show all discarded
    - [ ] Ability to see history (audit trail) for discarded as well
- [ ] Calculate expiration data programatically **(next semester)**
    - [ ] Add extra columns in database for scientists to add in more info on contents of solution
    - [ ] Use solution contents to calculate the expiration date

# Thomas' ToDo's
- [ ] Get the audit table working with the new generalized SampleTable component
    - [ ] probably will have to make the functions like onDelete, updateSample, onGenerateLabels
          inside of SampleTableProps optional.
    - [ ] SampleTable should also ensure that generate labels, delete labels, and view audit table buttons 
          are not shown inside of the grid toolbar.
- [ ] Implement the necessary functions inside of the SamplesPage and PSamplesPage (onRefresh, onGenerateLabels, onDelete)
- [ ] Work on generalizing the form component
- [ ] Work on the nav bar
- [ ] Get the printer working
- [ ] MAKE README BETTER!
- [ ] COMMENT ALL CODE :(((((!
- [ ] LEARN DOCKER!

# Server
- [x] Generate qr code keys using a seeded or consistent hash algorithm
- [x] Generate qr codes and be able to send them to front-end

# Client
- [x] Button to edit a sample in table format
    - [ ] Have a log somewhere that shows who edited what and when
- [ ] Clean up styles, remove unused styles and make website look better
- [x] Create different pages for (below) using react-router & react-router-dom. On top of this need to set up a router to redirect qr codes when scanned:
    - [x] Sample viewing
    - [x] Sample creating
    - [x] Edit log
    - [x] QR Code scanning
- [x] Fix default value for textfields that are supposed to have dates
- [x] MUI styles works sometimes and sometimes they dont -> could be because no theme is declared?
- [x] Plan for edit button functionality
    - When edit button is clicked, switch out the text in the table cell with a text field and change the edit icon to a checkmark and add an x next to it
- [ ] Make it so you cant create a sample that has the same properties as an existing one
    - if new_qr_code_key == existing_qr_code_key dont create that new sample
- [x] Add the ability to scan a qr code using scanner
- [ ] Possibly add the ability for scientist to have an account, basically just name so that you could sort by analyst. Or find all samples by a scientist. May not need cause you could just search anyway
- [ ] When creating a sample, cache the the form contents so that if the page is changed and then we come back, the form hasnt gone away