
<br />
<div align="center" >
  

  <h3 align="center">Track Table (Proof of Concept)</h3>

  <p align="center">
    A full rework of the track table.
    <br />
   
  </p>
</div>






<!-- ABOUT THE PROJECT -->
## About The Project




The existing track table code has rendered this particular feature unmaintainable and very difficult to work with.  It will now benefit greatly from a full rewrite using modern technologies, methods and a more readable and React centric approach.









### Built With

This project is using the following technologies:


- Languages
  - <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">Javascript</a>
  - <a href="https://www.typescriptlang.org/">Typescript</a>
- Frameworks
  - <a href="https://nextjs.org/">Next.js</a>
  - <a href="https://react.dev/">React</a>
- Libraries
  - <a href="https://tanstack.com/table/latest">Tanstack (React) Table</a>
  - <a href="https://tanstack.com/virtual/latest">Tanstack Virtual</a>
  - <a href="https://react-dnd.github.io/react-dnd/about">React DnD (drag and drop)</a>
  - <a href="https://www.radix-ui.com/">Radix UI</a>


  





<!-- GETTING STARTED -->

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.



The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.




<!-- USAGE EXAMPLES -->
## Usage

- The track table page enables a user to determine how tracks are scheduled and which students are assigned to each track.

- Requirements are as follows:
   - All available students in left hand table
   - Track selection column in the center
   - Assigned students in track tables to the right
   - Manual Save button and drag/drop delete icon at bottom of center column
 
   - All changes including drag and drop actions need to be manually saved via button

- Code behaviour and points to note:
  -    Each track needs to maintain state even when not showing.  Tracks are therefore rendered via CSS display once the page is mounted.  A retriever function is then set to each track on mount, and on save pulls the state from each track (via useTrackChanges.js hook).
  -    Files under folder named 'redundant' are mostly for generating mock code and will be replaced by existing code in app.
  -    A mixture of Typescript and Javascript is used.  This is mostly to enforce strict typing to use in the external table library (recommended).
  -    TrackSlotPageView.jsx is intended to be as readable as possible.  Informs the layout of the entire page and feature.
  -    Each student can only belong to one track at a time (useStudentsInTracksSet.js hook).
  -    This repository is intended purely as a Proof of Concept and will therefore require further revision (code, styling, etc) during port into the existing codebase.
 

  

