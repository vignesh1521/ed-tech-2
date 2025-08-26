export interface User_Type {
  id: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

export interface Course_Type {
  id: string;
  title: string;
  description: string;
  level: string;
  image: string;
}

export interface Enrollment_Type {
  id: string;
  user: Token_Type;
  course: Course_Type;
}

export interface Token_Type {
  id: string;        
  username: string;
  email: string;
  role: string;      
}



export interface Context_Type {
  user: Token_Type | null;
  users: User_Type | null;          
  CourseEnrolled: Enrollment_Type[] ; 
}