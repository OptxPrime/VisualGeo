# VisualGeo - visualization tool for geometric algorithms

This app was created for the course "Dynamic Web Systems" in the third year of Theoretical Computer Science, at The Faculty of Natural Sciences and Mathematics in Sarajevo.

## Goal

Since I'm very passionate about algorithms, I wanted to create an app that would involve coding and playing with some algorithms.
I ended up creating a simple app for visualisation of some well-known geometric algorithms like Graham Scan, Ear Clipping Triangulation, etc.

## App structure

On the homepage, the user can select one of the 3 algorithm categories: Convex Hull, Point in a Convex Polygon and Triangulation. Each category has its page that has two views: visual and description. Visual view, which is selected by default, contains a stage with geometric objects, and a footer with interaction options like selecting and starting an algorithm, incrementing algorithms steps, etc. Description view contains a description of currently selected algorithm, as well as references to materials for further reading.

## Algorithms

VisualGeo provides visualization for 4 algorithms: 
- Graham Scan and Gift Wrapping for finding a convex hull of a set of a points
- Ear-clipping algorithm for polygon triangulation
- Algorithm for finding if a point lies in a convex polygon in logarithmic time complexity
