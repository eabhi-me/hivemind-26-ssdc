export interface OrganizerMember {
  id: number;
  name: string;
  registrationNumber: string;
  trade: string;
  role: string;
  photoUrl?: string;
  socials: {
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

export interface FacultyAdvisor {
  id: string;
  name: string;
  role: string;
  title: string;
  trade: string;
  assignedEvent: string;
  linkedinUrl?: string;
}

export const FACULTY_MENTORS: FacultyAdvisor[] = [
  {
    id: 'fac-1',
    name: 'Dr. Manoj Kumar Sachan',
    role: 'FACULTY ADVISOR',
    title: 'Professor & Head, CSE Department',
    trade: 'Computer Science & Engineering',
    assignedEvent: 'Overall Festival Supervisor',
    linkedinUrl: 'https://www.linkedin.com/school/sant-longowal-institute-of-engineering-and-technology/',
  },
  {
    id: 'fac-2',
    name: 'Mr. Rahul Gautam',
    role: 'FACULTY CO-ADVISOR',
    title: 'Assistant Professor, CSE Department',
    trade: 'Computer Science & Engineering',
    assignedEvent: 'Faculty Convener / Jury Advisor',
    linkedinUrl: 'https://www.linkedin.com/school/sant-longowal-institute-of-engineering-and-technology/',
  },
];

export const OFFICIAL_ORGANIZERS: OrganizerMember[] = [
  {
    id: 1,
    name: "Jnanadatta Nayak",
    registrationNumber: "2341053",
    trade: "Computer Science & Engineering",
    role: "Coordinator",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/jd-nayak-0ab8062a6",
      github: "#"
    }
  },
  {
    id: 2,
    name: "Abhishek Yadav",
    registrationNumber: "2341032",
    trade: "Computer Science & Engineering",
    role: "Co Coordinator",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/eabhi-me",
      github: "https://github.com/eabhi-me"
    }
  },
  {
    id: 3,
    name: "Abhishek Kumar",
    registrationNumber: "2341012",
    trade: "Computer Science & Engineering",
    role: "CP Head",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/abhishek1101kumar",
      github: "#"
    }
  },
  {
    id: 4,
    name: "Aryan Sahu",
    registrationNumber: "2341049",
    trade: "Computer Science & Engineering",
    role: "Machine Learning Head",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/aryan-sahu-859865290",
      github: "#"
    }
  },
  {
    id: 5,
    name: "Priyanshu Vats",
    registrationNumber: "2341011",
    trade: "Computer Science & Engineering",
    role: "Development Head",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/priyanshu-vats-755a22289",
      github: "https://github.com/Priyanshuvats0"
    }
  },
  {
    id: 6,
    name: "Saloni Khatana",
    registrationNumber: "2341036",
    trade: "Computer Science & Engineering",
    role: "Social Media Head",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/saloni-khatana-422158290",
      github: "#"
    }
  },
  {
    id: 7,
    name: "Rahul Sharma",
    registrationNumber: "2431012",
    trade: "Computer Science & Engineering",
    role: "Outreach & PR Head",
    photoUrl: "",
    socials: {
      linkedin: "https://linkedin.com/in/rahul-sharma-aa9707273",
      github: "#"
    }
  }
];
