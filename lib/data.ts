export type Area = "Home" | "School" | "Projects" | "Family" | "Faith" | "Fun" | "Sports";

export const courses = [
  { code: "FYC 6234", school: "University of Florida", title: "Grant Writing", due: "Literature synthesis", when: "Today · 4:00 PM", urgent: true, progress: 72 },
  { code: "Non-Thesis Project", school: "University of Florida", title: "Research Project", due: "Review advisor notes", when: "Tomorrow", urgent: false, progress: 48 },
  { code: "ED 9413", school: "Mississippi State", title: "Educational Research", due: "Discussion response", when: "Wed · 11:59 PM", urgent: false, progress: 64 },
  { code: "EPOD Capstone", school: "Mississippi State", title: "Capstone", due: "Outline methods section", when: "Friday", urgent: false, progress: 35 },
  { code: "DSAB 629", school: "CUNY", title: "Data Strategy", due: "Read module 6", when: "Sep 12", urgent: false, progress: 81 }
];

export const projects = [
  { name: "Dr. Disruptor Hub", org: "Personal", stage: "BUILD", next: "Review command center prototype", color: "#e85c2b" },
  { name: "Future of Learning Lab", org: "UF", stage: "RESEARCH", next: "Synthesize interview notes", color: "#2564ad" },
  { name: "Community Impact Map", org: "Collective", stage: "PLAN", next: "Invite two pilot partners", color: "#8b63ad" }
];

export const familyEvents = [
  { time: "9:00", period: "AM", title: "Stavros · School bus", tone: "orange" },
  { time: "4:00", period: "PM", title: "Stavros · Home", tone: "blue" },
  { time: "5:30", period: "PM", title: "Crystal · Appointment", tone: "purple" }
];

export const fallbackGame = {
  opponent: "LIU Sharks", date: "September 5", kickoff: "7:30 PM ET", venue: "Ben Hill Griffin Stadium", status: "Schedule preview", source: "fallback" as const
};
