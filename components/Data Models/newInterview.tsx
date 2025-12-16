'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { CreateInterviewDTO, Section, getClassesBySection, getSubjectsBySection } from '@/types/interview.types';


export default function InterviewForm() {
    const [isLoading, setIsLoading] = useState(true);

    // Form states
    const [interviewData, setInterviewData] = useState<CreateInterviewDTO>({
        firstName: '',
        lastName: '',
        otherNames: '',
        section: '',
        class: '',
        subject: '',
        score: 0,
        status: 'pending',
        issuedBy: 'Head Teacher',
        previousSchool: '',
    });

    const availableClasses = getClassesBySection(interviewData.section as Section);
    const availableSubjects = getSubjectsBySection(interviewData.section as Section);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleInterviewChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value.toUpperCase() });
    };
    const handleDropInterviewChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
    };

    const handleInterviewSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        // Send data to backend
        try {
            const response = await fetch("https://mjs-backend-server.onrender.com/interviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // tell backend it's JSON
                },
                body: JSON.stringify(interviewData), // send the form data
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const savedInterview = await response.json();

            console.log("✅ Interview successfully saved:", savedInterview);

        } catch (error) {
            console.error("❌ Error submitting interview:", error);
        }

        setIsLoading(false);
        window.location.reload();
    };


    // Interview Form
    return (
        <form onSubmit={handleInterviewSubmit} className="p-6 md:p-12">
            <div className='flex flex-col'>
                <span className="text-lg font-semibold text-[#374151]">Interviewee Details</span>
                <span className="text-xs font-light mb-4 text-gray-400">Who is taking on this interview?</span>
            </div>

            {/* Name */}
            <div className='grid grid-cols-6 md:grid md:grid-cols-3 gap-4'>
                <div className="mb-2 col-span-3 md:col-span-1 ">
                    <label className="block text-gray-700 text-sm">First Name <span className='text-red-500'>*</span></label>
                    <input
                        type="text"
                        name="firstName"
                        value={interviewData.firstName}
                        onChange={handleInterviewChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2 col-span-3 md:col-span-1 ">
                    <label className="block text-gray-700 text-sm">Surname <span className='text-red-500'>*</span></label>
                    <input
                        type="text"
                        name="lastName"
                        value={interviewData.lastName}
                        onChange={handleInterviewChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-2 col-span-6 md:col-span-1 ">
                    <label className="block text-gray-700 text-sm">Other Names <span className='text-red-500'>*</span></label>
                    <input
                        type="text"
                        name="otherNames"
                        value={interviewData.otherNames}
                        onChange={handleInterviewChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-6 gap-4">
                <div className="mb-4 col-span-6 md:col-span-6">
                    <label className="block text-gray-700">Previous School</label>
                    <input
                        type="text"
                        name="previousSchool"
                        value={interviewData.previousSchool}
                        onChange={handleInterviewChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4 col-span-6 md:col-span-2">
                    <label className="block text-gray-700">Education Level</label>
                    <select
                        name="section"
                        value={interviewData.section}
                        onChange={handleDropInterviewChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value=''>--Select--</option>
                        <option value="Pre-Primary">Pre-Primary</option>
                        <option value="Primary">Primary</option>
                    </select>
                </div>
                <div className="mb-4 col-span-3 md:col-span-2">
                    <label className="block text-gray-700">Class</label>
                    {interviewData.section === 'Primary' && (
                        <select
                            name="class"
                            value={interviewData.class}
                            onChange={handleDropInterviewChange}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value=''>Select Class</option>
                            {availableClasses.map((className) => (
                                <option key={className} value={className}>{className}</option>
                            ))}
                        </select>
                    )}
                    {
                        interviewData.section === 'Pre-Primary' && (
                            <select
                                name="class"
                                value={interviewData.class}
                                onChange={handleDropInterviewChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value=''>-- Select Class --</option>
                                {availableClasses.map((className) => (
                                    <option key={className} value={className}>{className}</option>
                                ))}
                            </select>
                        )}
                    {
                        interviewData.section === '' && (
                            <select
                                name="class"
                                className="w-full p-2 border rounded"
                                required
                                disabled
                            >
                                <option value='' className='hidden'>-- Select Level --</option>
                            </select>
                        )}

                </div>
                <div className="mb-4 col-span-3 md:col-span-2">
                    <label className="block text-gray-700">Subject</label>
                    {
                        interviewData.section === 'Pre-Primary' && (
                            <select
                                name="subject"
                                value={interviewData.subject}
                                onChange={handleDropInterviewChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value=''>-- Select Subject --</option>
                                {availableSubjects.map((subject) => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        )
                    }
                    {
                        interviewData.section === 'Primary' && (
                            <select
                                name="subject"
                                value={interviewData.subject}
                                onChange={handleDropInterviewChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value=''>-- Select Subject --</option>
                                {
                                    availableSubjects.map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))
                                }
                            </select>
                        )
                    }
                    {
                        interviewData.section === '' && (
                            <select
                                name="subject"
                                value={interviewData.subject}
                                onChange={handleDropInterviewChange}
                                className="w-full p-2 border rounded"
                                required
                                disabled
                            >
                                <option value=''>-- Select Subject --</option>
                            </select>
                        )
                    }
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
                    {isLoading ? 'Submitting...' : 'Submit Interview'}
                </button>
            </div>
        </form>
    );

};