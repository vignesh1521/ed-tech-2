import bcrypt from "bcryptjs";
import {  Enrollment_Type, User_Type } from "./types";

export const users: User_Type[] = [
  {
    id: '1',
    email: "admin@1",
    username: "admin",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin"
  },
  {
    id: '2',
    email: "user@1",
    username: "john",
    password: bcrypt.hashSync("user123", 10),
    role: "user"
  },
  {
    id: '3',
    email: "test@123",
    username: "robert",
    password: bcrypt.hashSync("test123", 10),
    role: "user"
  }
];

export const CourseEnrolled: Enrollment_Type[] = [];
