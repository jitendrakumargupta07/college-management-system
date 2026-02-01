// Script to add sample data for new features
const mongoose = require('mongoose');
const ExamTimeTable = require('./models/ExamTimeTable');
const Notice = require('./models/Notice');
const Subject = require('./models/Subject');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected for seeding data");

    // Add sample exam time table
    const examTimeTable = new ExamTimeTable({
      course: "Computer Science",
      semester: 1,
      exams: [
        {
          subject: "Mathematics",
          date: new Date("2024-12-15"),
          time: "10:00 AM",
          venue: "Hall A"
        },
        {
          subject: "Physics",
          date: new Date("2024-12-16"),
          time: "2:00 PM",
          venue: "Hall B"
        },
        {
          subject: "Chemistry",
          date: new Date("2024-12-17"),
          time: "10:00 AM",
          venue: "Hall C"
        }
      ]
    });
    await examTimeTable.save();

    // Add sample notices
    const notices = [
      {
        title: "Semester Examination Schedule Released",
        content: "The examination schedule for Semester 1 has been released. Please check the exam time table section for details.",
        type: "exam",
        priority: "high"
      },
      {
        title: "Fee Payment Deadline Extended",
        content: "The deadline for fee payment has been extended to December 31st, 2024. Late fees will apply after this date.",
        type: "fee",
        priority: "medium"
      },
      {
        title: "Welcome to New Students",
        content: "Welcome to all newly admitted students! Please complete your admission formalities and update your profile information.",
        type: "admission",
        priority: "low"
      }
    ];

    for (const notice of notices) {
      const newNotice = new Notice(notice);
      await newNotice.save();
    }

    // Add sample subjects
    const subjects = [
      {
        name: "Data Structures and Algorithms",
        code: "CS101",
        course: "Computer Science",
        semester: 3,
        syllabus: {
          topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Sorting Algorithms", "Searching Algorithms"],
          description: "Comprehensive study of data structures and algorithms with practical implementations.",
          credits: 4
        }
      },
      {
        name: "Database Management Systems",
        code: "CS201",
        course: "Computer Science",
        semester: 4,
        syllabus: {
          topics: ["Relational Model", "SQL", "Normalization", "Transaction Management", "Concurrency Control", "Database Security"],
          description: "Introduction to database design, implementation, and management systems.",
          credits: 3
        }
      },
      {
        name: "Web Technologies",
        code: "CS301",
        course: "Computer Science",
        semester: 5,
        syllabus: {
          topics: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "REST APIs"],
          description: "Full-stack web development using modern technologies and frameworks.",
          credits: 4
        }
      }
    ];

    for (const subject of subjects) {
      const newSubject = new Subject(subject);
      await newSubject.save();
    }

    console.log("Sample data added successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });