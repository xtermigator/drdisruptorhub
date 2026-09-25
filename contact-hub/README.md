# Dr. Disruptor Contact Hub

Central signup system for the Dr. Disruptor ecosystem.

## What it does
- One master contact per normalized email address
- Optional phone number
- Separate email and SMS consent
- Interest tagging
- Source-site, source-page, and campaign tracking
- Signup-event history
- Netlify Database migrations
- Netlify Function at `/api/signup`

## Deploy
This package is designed for the Netlify project `dr-disruptor-contact-hub`.
Netlify Database is provisioned automatically when the project is deployed.

## Source tracking
Link to the signup page with query parameters, for example:

`/?source=Hellenic%20Kids&campaign=footer-signup`

or

`/?source=XTERMIGATOR%20Kids&campaign=book-launch`

## Next phase
Add a privacy-policy page, confirmation email workflow, unsubscribe/preference center,
and email/SMS provider synchronization before large-scale marketing use.
