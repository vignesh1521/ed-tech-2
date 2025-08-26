'use client';

import { useAuth } from '@/context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import './course.css'

export default function Dashboard() {
    type Course = {
        id: string;
        title: string;
        level: string;
        description: string;
        image: string;
    };
    const { user, loading } = useAuth();
    const [course, setCourse] = useState<Course | null>(null)
    const [reload, setReload] = useState(1)

    const router = useRouter();
    const params = useParams();


    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);


    useEffect(() => {
        const fetchCourseById = async () => {
            const query = `
                query GetCourseById($id: ID!) {
                    getCourseById(id: $id) {
                    id
                    title
                    description
                    image
                    }
                }
                `;
            const variables = { id: params?.id };

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
                setCourse(result.data.getCourseById)
            } catch (err) {
                console.error('Network or GraphQL error:', err);
            }
        };

        fetchCourseById();
    }, [params?.id,reload])

    const enrollUser = async () => {
        const mutation = `
      mutation EnrollUser( $courseId: ID!) {
        enrollUserInCourse( courseId: $courseId) {
          id
          course {
            id
            title
          }
        }
      }
    `;

        const variables = {
            courseId: course?.id,
        };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                alert(`Enrollment failed: ${result.errors[0].message}`)
                console.error('Enrollment failed:', result.errors);
            } else {
                router.push(`/course-enrolled/${params?.id}`)
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const handleEdit = async (title: string) => {
        const newTitle = prompt("Enter the new title", title)

        const mutation = `
      mutation($courseId: ID!, $courseTitle: String!){
  updateCourseTitle(courseId: $courseId, CourseTitle: $courseTitle) {
    id
    title
  }
}
    `;

        const variables = {
            courseId: course?.id,
            courseTitle: newTitle
        };

        try {
            const response = await fetch('/api/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('token')}`

                },
                body: JSON.stringify({ query: mutation, variables }),
            });

            const result = await response.json();

            if (result.errors) {
                alert(`Edit failed: ${result.errors[0].message}`)
                console.error('Edit failed:', result.errors);
            } else {
                setReload(reload+1)
                

            }
        } catch (error) {
            console.error('Network error:', error);
        }

    }


    if (loading) {
        return <p>Loading..</p>;
    }

    return (
        <>
            <div className='header'>
                <div className='logo'>
                    <h3>ED-TECH</h3>
                </div>
                <div className='btns'>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' onClick={() => { router.push('/enrolled') }}>Enrolled</button>
                    <button onClick={() => { router.push('/login') }} className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>LogOut</button>
                </div>
            </div>
            {
                course && <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <Image
                            src={course.image}
                            alt={course.title}
                            className="w-full h-64 object-cover"
                            unoptimized
                            width={100} height={100}
                        />

                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
                            <p className="text-gray-600 mb-4">{course.description}</p>

                            <div className="flex gap-4 mt-6">
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={enrollUser}>
                                    Enroll
                                </button>
                                {user?.role == 'admin' ? <button onClick={() => handleEdit(course.title)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                                    Edit
                                </button> : <></>}

                                <button
                                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Go Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            }

        </>
    );
}
