'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context';

export default function EnrollmentSuccessPage() {
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);

    type Course = {
        id: string;
        title: string;
        level: string;
        description: string;
        image: string;
    };
    const { user, loading } = useAuth();
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
                    level
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
    }, [params?.id])

    if (!course) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-4">No enrollment found</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => router.push('/dashboard')}
                >
                    Go Home
                </button>
            </div>
        );
    }


    return (
        <div className="max-w-8xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4 text-green-600">🎉 Enrollment Successful!</h1>
            <p className="mb-6 text-gray-700">You have successfully enrolled in the course below:</p>

            <div className="border rounded-lg p-6 shadow-md">
                <Image
                    src={course.image}
                    alt={course.title}
                    className="w-full h-64 object-cover"
                    unoptimized 
                    width={100} height={100}
                />
                <h2 className="text-2xl font-semibold">{course.title}</h2>
                <p className="text-gray-600 mt-2">{course.description}</p>
                <span className="inline-block mt-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Level: {course.level}
                </span>
            </div>

            <div className="mt-6 flex gap-4">
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                    onClick={() => router.push('/dashboard')}
                >
                    Go Home
                </button>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => router.push(`/course-data/${course.id}`)}
                >
                    View Course
                </button>
            </div>
        </div>
    );
}
