14:08

debugged

- can now log out serial tracks correctly
  - contains track slots
  - track slots contain students

---

12:45

serialTrackGenerator

- takes Track and converts it to relevant Track type for purpose of the feature
- adds TrackSlots instead of single rows
- removes cols as they are dealt with in the table itself now

trackSlotGenerator

- returns track slot id and index
- returns the list of students that are to be
  converted into its rows

10:19

currently we have

- studentIndex Generator

  - takes from student generator - id: index, name:
  - returns [students], index, durationMins

- trackGenerator

  - returns track object taken from aoTracks
  - calls studentIndex generator to assign student index

- student generator
  - returns 50 students, same name, index as id
  - used in student index generator
