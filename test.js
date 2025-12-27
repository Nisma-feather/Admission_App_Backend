const connectDB = require("./config/db");
const Location = require("./models/Location");
const Course = require("./models/Courses")

connectDB();

const dummyCourses = [
  {
    college: "69467f03209597e97d81ae60",
    name: "B.Tech CSE",
    degree: "Bachelor of Technology",
    level: "UG",
    category: "Engineering",
    specialization: "Computer Science and Engineering",
    duration: 4,
    fees: { min: 80000, max: 120000 },
    intake: 120,
    eligibility: "10+2 with PCM",
    entranceExams: ["JEE", "TNEA"],
  },
  {
    college: "69467f03209597e97d81ae60",
    name: "B.Tech IT",
    degree: "Bachelor of Technology",
    level: "UG",
    category: "Engineering",
    specialization: "Information Technology",
    duration: 4,
    fees: { min: 75000, max: 110000 },
    intake: 90,
    eligibility: "10+2 with PCM",
    entranceExams: ["JEE", "TNEA"],
  },
  {
    college: "69467f03209597e97d81ae60",
    name: "B.Tech ECE",
    degree: "Bachelor of Technology",
    level: "UG",
    category: "Engineering",
    specialization: "Electronics and Communication Engineering",
    duration: 4,
    fees: { min: 70000, max: 100000 },
    intake: 120,
    eligibility: "10+2 with PCM",
    entranceExams: ["JEE", "TNEA"],
  },
  {
    college: "69467fd1209597e97d81ae69",
    name: "B.Tech Mechanical",
    degree: "Bachelor of Technology",
    level: "UG",
    category: "Engineering",
    specialization: "Mechanical Engineering",
    duration: 4,
    fees: { min: 65000, max: 95000 },
    intake: 120,
    eligibility: "10+2 with PCM",
    entranceExams: ["TNEA"],
  },
  {
    college: "6946857b69ea4737bffcdad2",
    name: "B.Tech Civil",
    degree: "Bachelor of Technology",
    level: "UG",
    category: "Engineering",
    specialization: "Civil Engineering",
    duration: 4,
    fees: { min: 60000, max: 90000 },
    intake: 60,
    eligibility: "10+2 with PCM",
    entranceExams: ["TNEA"],
  },

  // 🔹 PG COURSES
  {
    college: "69467fd1209597e97d81ae69",
    name: "M.Tech CSE",
    degree: "Master of Technology",
    level: "PG",
    category: "Engineering & Technology",
    specialization: "Computer Science and Engineering",
    duration: 2,
    fees: { min: 90000, max: 150000 },
    intake: 30,
    eligibility: "B.Tech CSE / IT",
    entranceExams: ["GATE"],
  },
  {
    college: "69467fd1209597e97d81ae69",
    name: "M.Tech Data Science",
    degree: "Master of Technology",
    level: "PG",
    category: "Engineering & Technology",
    specialization: "Data Science",
    duration: 2,
    fees: { min: 100000, max: 180000 },
    intake: 30,
    eligibility: "B.Tech / B.E",
    entranceExams: ["GATE"],
  },
  {
    college: "6946864769ea4737bffcdae5",
    name: "MBA",
    degree: "Master of Business Administration",
    level: "PG",
    category: "Arts & Science",
    specialization: "Business Administration",
    duration: 2,
    fees: { min: 120000, max: 250000 },
    intake: 60,
    eligibility: "Any UG Degree",
    entranceExams: ["CAT", "MAT", "TANCET"],
  },

  // 🔹 DIPLOMA
  {
    college: "6946864769ea4737bffcdae5",
    name: "Diploma Mechanical",
    degree: "Diploma",
    level: "Diploma",
    category: "Diploma",
    specialization: "Mechanical Engineering",
    duration: 3,
    fees: { min: 30000, max: 50000 },
    intake: 60,
    eligibility: "10th Pass",
  },
  {
    college: "694686bb69ea4737bffcdaf1",
    name: "Diploma Electrical",
    degree: "Diploma",
    level: "Diploma",
    category: "Diploma",
    specialization: "Electrical Engineering",
    duration: 3,
    fees: { min: 30000, max: 50000 },
    intake: 60,
    eligibility: "10th Pass",
  },

  // 🔹 OTHER DOMAINS
  {
    college: "694686bb69ea4737bffcdaf1",
    name: "B.Arch",
    degree: "Bachelor of Architecture",
    level: "UG",
    category: "Architecture",
    specialization: "Architecture",
    duration: 5,
    fees: { min: 90000, max: 150000 },
    intake: 40,
    eligibility: "10+2 with Maths",
    entranceExams: ["NATA"],
  },
  {
    college: "6946869369ea4737bffcdaeb",
    name: "B.Sc Agriculture",
    degree: "Bachelor of Science",
    level: "UG",
    category: "Agriculture",
    specialization: "Agriculture",
    duration: 4,
    fees: { min: 40000, max: 70000 },
    intake: 60,
    eligibility: "10+2 Biology",
  },
  {
    college: "6946869369ea4737bffcdaeb",
    name: "BHM",
    degree: "Bachelor of Hotel Management",
    level: "UG",
    category: "Hotel Management",
    specialization: "Hotel Management",
    duration: 3,
    fees: { min: 60000, max: 100000 },
    intake: 60,
    eligibility: "10+2 Any Stream",
  },
  {
    college: "6946869369ea4737bffcdaeb",
    name: "BA Journalism",
    degree: "Bachelor of Arts",
    level: "UG",
    category: "Media & Communication",
    specialization: "Journalism and Mass Communication",
    duration: 3,
    fees: { min: 45000, max: 80000 },
    intake: 40,
    eligibility: "10+2 Any Stream",
  },
  {
    college: "694686bb69ea4737bffcdaf1",
    name: "PhD CSE",
    degree: "Doctor of Philosophy",
    level: "PhD",
    category: "Engineering & Technology",
    specialization: "Computer Science",
    duration: 5,
    fees: { min: 50000, max: 100000 },
    eligibility: "M.Tech / M.E",
  },
];



const insertManyCourses=async()=>{
  try{
   
    const courses = await Course.insertMany(dummyCourses);

      console.log("Course details inserted successfullt");
      



  }
  catch(e){
    console.log(e);
    return res.status(500).json({message:"Can't able to insert the courses"})
    
  }
}

insertManyCourses()