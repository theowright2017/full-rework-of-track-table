import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import trackGenerator from "./api/trackGenerator";
import serialTrackGenerator from "./api/serialTrackGenerator";

// const inter = Inter({ subsets: ["latin"] });

const tracks = trackGenerator;

export default function Home() {
  const serialTracks = tracks.map((track) => serialTrackGenerator(track));

  console.log("serial tracks::: ", serialTracks);
  return (
    <></>
    // <TrackSlotView />
  );
}

/*

  <TrackSlotPageView  ==  

    <Left Table  == 
        <React Table
        <Table Info
            - total for rows & cols

    <Tracks Container

        <Track Columns
            <List Of Tracks
            <Save And Delete Area

        <Droppable Table Container
            <Duratio Header
            <Droppable Table
                <Length Cell
                <Input Cell
                    - both of which will be connected to all other lenght and input cells
                    - also connected to duration header
                <Track Slots
                    <Student Row  
                        - needs to be droppable
                        - drag from student list - copy
                        - drag from other table - move
                        - needs to compare against all other cohorts in exam - Set? to check student is / isn't in cohorts?
                <Break Slots
                    - needs to be added at end of every period after minsBetweenBreaks(?)
            <Table Info Inc. Buttons
                - total for rows and cols
                - slot and student buttons


  MAIN POINTS
  - need to keep track of changes to track slots and rows.  Ideally just in state, in right container?
    - on save, bundle up into relevant BE format
    - on cancel, revert to default data that was originally set

  - initial data
    - student list
      - comes from prepareLeftPanel
      - row data taken from aoStudentsByAssessment
      - check to see what properties are required from this
    - tracks
      - oRightCols - taken from aoTracks (BE response in getExamDetails)
    - right drop table
      - columns same source for both tables
      - rows come from studentIndex which is from aoTracks

*/
