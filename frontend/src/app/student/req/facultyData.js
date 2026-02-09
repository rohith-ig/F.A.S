const dateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

export const facultyProfiles = [
  {
    id: "f-101",
    name: "Dr. Raju",
    department: "Computer Science",
    focus: "Distributed Systems, Advising",
    location: "Block B, Room 302",
    slotWindows: ["10:00 AM - 10:30 AM", "2:00 PM - 2:30 PM", "4:30 PM - 5:00 PM"],
  },
  {
    id: "f-102",
    name: "Prof. Himanshi",
    department: "Information Systems",
    focus: "Project Reviews, Career Guidance",
    location: "Block A, Room 118",
    slotWindows: ["9:30 AM - 10:00 AM", "1:00 PM - 1:30 PM", "3:00 PM - 3:30 PM"],
  },
  {
    id: "f-103",
    name: "Dr. Priya Nair",
    department: "Data Science",
    focus: "Research Mentorship, Thesis Support",
    location: "Research Wing, Room 12",
    slotWindows: ["10:30 AM - 11:00 AM", "1:30 PM - 2:00 PM", "4:00 PM - 4:30 PM"],
  },
];

export function getFacultyById(id) {
  return facultyProfiles.find((faculty) => faculty.id === id);
}

export function getFacultySlotsForNextDays(faculty, days = 5) {
  const slots = [];
  const today = new Date();

  for (let offset = 0; offset < days; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateLabel = dateFormatter.format(date);

    faculty.slotWindows.forEach((window) => {
      slots.push(`${dateLabel} | ${window}`);
    });
  }

  return slots;
}
