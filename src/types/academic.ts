export interface ExamApiResponse {
  examId: string;
  examName: string;
  examLevel: string;
  examType: string;
  iconUrl: string;
  bannerUrl: string;
  popularityCount: number;
}

export interface Exam {
  id: string;
  name: string;
  level: string;
  type: string;
  iconUrl: string;
  bannerUrl: string;
  popularity: number;
}

export interface CourseApiResponse {
  courseId: string;
  courseName: string;
  courseType: string;
  streamLevel: string;
  coursePhotoUrl: string;
  duration: string;
  popularityCount: number;
  courseIconUrl: string;
}

export interface Course {
  id: string;
  name: string;
  type: string;
  level: string;
  photoUrl: string;
  duration: string;
  popularity: number;
  iconUrl: string;
}

export interface CollegeApiResponse {
  collegeId: string;
  collegeName: string;
  collegesLocationCity: string;
  collegesLocationState: string;
  logoUrl: string;
  establishedYear: string;
  accreditation: string;
  coursesOffered: CourseOffered[];
  collegeType: string;
  popularityCount: number;
}

export interface CourseOffered {
  courseType: string;
  nirfRank: string;
  eligibility: string;
  rankingBodies: string;
  branches: Branch[];
  generalFees: string;
  globalRecruiters: string;
  duration: string;
  examsAccepted: ExamAccepted[];
  courseName: string;
  courseLevel: string;
  placementCellContact: string;
  approvals: string;
  highestSalary: string;
  averageSalary: string;
  courseId: string;
}

export interface Branch {
  seat: string;
  branchId: string;
  topRecruiters: string;
  headOfDepartment: string;
  facultyCount: string;
  labsAvailable: string;
  highestSalary: string;
  branchName: string;
  averageSalary: string;
}

export interface ExamAccepted {
  examName: string;
  fee: string;
  examId: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  logoUrl: string;
  establishedYear: string;
  accreditation: string;
  type: string;
  popularity: number;
  coursesOffered: CourseOffered[];
}


export interface CounsellorApiResponse {
  counsellorId: string;
  firstName: string;
  lastName: string;
  photoUrlSmall: string | null;
  rating: number | null;
  ratePerYear: number | null;
  experience: string | null;
  languagesKnow: string[];
  city: string;
  workingDays: string[];
  plan: string | null;
  numberOfRatings: string;
}

// Comprehensive type for detailed counselor data (getCounselorById)
export interface CounselorDetails {
  userName: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  description: string;
  email: string;
  walletAmount: number;
  transactions: Transaction[];
  bankDetails: unknown | null;
  photoUrl: string;
  photoUrlSmall: string;
  password: string;
  organisationName: string;
  experience: string;
  activityLog: ActivityLog[];
  callHistory: unknown | null;
  stateOfCounsellor: string[];
  chatIdsCreatedForCounsellor: ChatId[];
  ratePerYear: number;
  plusAmount: number;
  proAmount: number;
  eliteAmount: number;
  ratePerMinute: number | null;
  expertise: string[];
  noOfClients: number | null;
  noOfFollowers: number | null;
  clients: Client[];
  followerIds: string[] | null;
  rating: number;
  languagesKnow: string[];
  reviewIds: string[];
  minuteSpendOnCall: number | null;
  minuteSpendOnVideoCall: number | null;
  state: string | null;
  fcmToken: string;
  voipToken: string | null;
  platform: string;
  currectCallUUID: string | null;
  workingDays: string[];
  officeStartTime: string;
  officeEndTime: string;
  fullOfficeAddress: OfficeAddress;
  phoneOtpVerified: boolean;
  emailOtpVerified: boolean;
  appointmentIds: string[];
  notesForCounsellorRelatedToUser: Record<string, unknown> | null;
  plusSeats: string;
  proSeats: string;
  eliteSeats: string;
  dateCreated: Timestamp | null;
  lastDateAndTimeModified: Timestamp;
  lastLoginDateAndTime: Timestamp;
  verified: boolean;
}

export interface Transaction {
  type: string;
  amount: number;
  timestamp: number;
  description: string;
  paymentId: string;
  counsellorId: string;
  userId: string;
  method: string;
  status: string;
}

export interface ActivityLog {
  activity: string;
  timestamp: Timestamp;
  id: string;
  photo: string | null;
  activityType: string;
  activitySenderId: string;
  activitySenderRole: string;
}

export interface ChatId {
  user1: string;
  user2: string;
  chatId: string;
}

export interface Client {
  userId: string;
  plan: string;
  subscriptionMode: string;
}

export interface OfficeAddress {
  role: string | null;
  officeNameFloorBuildingAndArea: string | null;
  city: string;
  state: string | null;
  pinCode: string | null;
  latCoordinate: number | null;
  longCoordinate: number | null;
}

export interface Timestamp {
  seconds: number;
  nanos: number;
}

// Slot system types
export interface TimeSlot {
  time: string;
  available: boolean;
  slotId?: string;
}

export interface SlotSection {
  title: string;
  slots: TimeSlot[];
}

export interface CounselorNonAvailability {
  // Add properties based on API response structure
  // This will be updated once we know the exact response format
  [key: string]: unknown;
}


export interface Counselor {
  id: string;
  name: string;
  description: string;
  experience: string;
  imageUrl: string;
  verified: boolean;
}


export interface AllCounselor {
  counsellorId: string;
  firstName: string;
  lastName: string;
  photoUrlSmall?: string | null;
  rating?: number | null;
  ratePerYear?: number | null;
  experience?: string | null;
  languagesKnow?: string[];
  city?: string;
  workingDays?: string[];
  plan?: string | null;
  subscriptionMode?: string | null;
  numberOfRatings?: string;
  states?: string[];
}

export interface CousrseApiLogin{
  courseId:string
  name:string
  image:string
  description:string
  duration:string
  tagline:string
  popularityCount:number
}

export interface StatesApiResponse{
  stateId:string
  name:string
  image:string
  popularityCount:28
}

export interface PatchUser{
    userInterestedStateOfCounsellors: string [],
    interestedCourse:string | null
}
