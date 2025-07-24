// src/data/assets.js
import logo from './logo.png';
import profile_icon from './profile_icon.png';
import attandence from './attandence.png';
import coursemate from './coursemate.png';
import event from './event.png';
import lostfound from './lostfound.png';
import resume from './resume.png';
import default_image from './default.png'

const dummyProjects = [
  {
    id: 1,
    image: event,
    title: "College Event Management App",
    description: "An app to manage registrations, event schedules, and updates for college events.",
    techStack: ["React", "Firebase", "Tailwind CSS"],
    skillsRequired: ["Frontend", "Firebase", "UI/UX"],
    author: "Ayush Kumar",
    email: "ayush@example.com",
    createdAt: "2025-07-20",
  },
  {
    id: 2,
    image: resume,
    title: "AI-Powered Resume Builder",
    description: "Build resumes with GPT suggestions and easy templates. Resume PDF export included.",
    techStack: ["React", "Node.js", "OpenAI API"],
    skillsRequired: ["React", "APIs", "Backend"],
    author: "Priya Shah",
    email: "priya@example.com",
    createdAt: "2025-07-18",
  },
  {
    id: 3,
    image: lostfound,
    title: "Lost & Found System for Campus",
    description: "A web app for students to post lost or found items inside college campus.",
    techStack: ["MongoDB", "Express", "React", "Node"],
    skillsRequired: ["MERN", "REST APIs"],
    author: "Raj Mehra",
    email: "raj@example.com",
    createdAt: "2025-07-16",
  },
  {
    id: 4,
    image: coursemate,
    title: "CourseMate - Peer Notes Sharing",
    description: "A place to upload and access semester-wise notes from fellow students.",
    techStack: ["Next.js", "Supabase"],
    skillsRequired: ["Frontend", "Auth", "Cloud Storage"],
    author: "Sanya Verma",
    email: "sanya@example.com",
    createdAt: "2025-07-10",
  },
  {
    id: 5,
    image: attandence,
    title: "Attendance Tracker with QR Code",
    description: "Faculty scans student QR to mark attendance. Admin panel for record export.",
    techStack: ["React Native", "Node.js", "MongoDB"],
    skillsRequired: ["React Native", "Mobile", "QR Code"],
    author: "Arjun Nair",
    email: "arjun@example.com",
    createdAt: "2025-07-05",
  }
];

export default dummyProjects;



export const assets = {
  logo,
  profile_icon,
  default_image,
}