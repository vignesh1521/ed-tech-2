'use client';

import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './style.css'
export default function Dashboard() {
    type Course = {
        id: string;
        title: string;
        level: string;
        description: string;
        image: string;
    };


    type Enrollment = {
  id: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
  course: Course;
};
    const { user, loading } = useAuth();
    const [courses, setCourses] = useState<Course[]>([])
    const router = useRouter();



    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);


    useEffect(() => {
        const fetchUserEnrolledCourses = async () => {

            const query = `
            query($getUserEnrolledCoursesId: ID!) {
                getUserEnrolledCourses(id: $getUserEnrolledCoursesId) {
                    id
                    user {
                        id
                        email
                        username
                    }
                    course {
                        id
                        title
                        description
                        image
                        level
                    }
                }
            }
        `;

            const variables = {
                getUserEnrolledCoursesId: user?.id
            };

            try {
                const response = await fetch('/api/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ query, variables }),
                });

                const result = await response.json();

                if (result.errors) {
                    console.error('GraphQL error:', result.errors);
                    return;
                }

                const coursesData = result.data.getUserEnrolledCourses.map((enrollment: Enrollment) => enrollment.course);
                setCourses(coursesData);
            } catch (err) {
                console.error('Network or GraphQL error:', err);
            }
        };

        if (!loading && user?.id) {
            fetchUserEnrolledCourses();
        }
    }, [user, loading]);


    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className='header'>
                <div className='logo'>
                    <h3>ED-TECH</h3>
                </div>
                <div className='btns'>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Enrolled</button>
                    <button onClick={() => { router.push('/login') }} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>LogOut</button>
                </div>
            </div>

            <div className='head-line'>
                <div className='head-title'>
                    <h1>
                        Explore Courses
                    </h1>
                </div>
                <div className='slogan'>Authentic and high quality courses, specially curated by experienced teachers for deep study.</div>
                <div className='search'>

                    <input type="search" placeholder='search Courses' />
                    <button>search</button>
                </div>
            </div>

            <div className='course-container'>
                <div className="course-grid">

                {courses.length ===0 ?<><h1>No Enrolled Courese. Return <a className='text-blue-500 hover:underline' onClick={()=>router.push('./dashboard')}>Home</a></h1></>:<></>}

                    {courses.map((crs, index) => {
                        return (
                            <div className="course-card" key={index}>
                                <Image src={crs.image} alt="Course Image" unoptimized  width={100} height={100} />
                                <div className="course-content">
                                    <div className="course-title">{crs.title}</div>
                                    <div className="course-level">{crs.level}</div>
                                    <div className="course-description">{crs.description || "No description available."}</div>
                                    <div className="flex gap-4 mt-6">
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={() => router.push(`/course-data/${crs.id}`)}>
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    );
}
