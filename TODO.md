# Server
- [x] Implement printing using node-brother-lable-printer library
- [√] Generate qr code keys using a seeded or consistent hash algorithm
- [√] Generate qr codes and be able to send them to front-end

# Client
- [x] Button to edit a sample in table format
    - Have a log somewhere that shows who edited what and when
- [x] Clean up styles, remove unused styles and make website look better
- [x] Create different pages for:
    - Sample viewing
    - Sample creating
    - Edit log
    - QR Code scanning
- [x] Fix default value for textfields that are supposed to have dates
- [x] MUI styles works sometimes and sometimes they dont -> could be because no theme is declared?

# Label Management
- Labels are generated once upon request and cached
- Labels will be re-generated when edited
- If we get the same label twice just generate once then return cached base64 string or img obj