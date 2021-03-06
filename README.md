# vue-flipped-classroom

Sample Vue Application to flip a classroom.
  - Vue front end and Slim PHP to intereact with Google Auth. 
  - No database required, used in conjunction with Google Docs.
  - YouTube API to monitor student video activity.
  - Includes KaTex to render math fonts. 
  - Styled with Vuetify. 
  
[Onlie Demo](http://mathcart.com/app/#/ "MathCart.com")

# What does flip the classroom mean? 
Traditionally, teachers lecture in the classroom and expect students to understand enough of the material to do the homework, but this can be problematic given students absorb information in different ways and at different speeds. When a teacher flips a class, the students are introduced to material outside the classroom through various means like videos, text and online presentations. Afterwards, the students their "homework" in the class and the teacher acts as a facilitator instead of a lecture. 

# How can this applicaiton help?

Teachers can manage aspects of flipping the classroom through this application by:
  - Assign videos to watch in place of lectures 
  - Posting demo problems
  - Assigning classwork and homework
  - Monitor activity
    - After the student creates an account through google auth, the app automatically creates a spreadsheet within the student's google drive, and shares it with the teacher.
    - Each time the student engages with videos or sample problems, the app records start times and finish times into the student's spreadsheet. 
