'use client';
import { Info } from 'lucide-react';
import React from 'react'
import { useState, useEffect } from 'react';
import { InterviewScoreDTO, UpdateInterviewDTO, Section, CLASS_BY_SECTION, getClassesBySection, getSubjectsBySection } from '@/types/interview.types';


export default function UpdateInterviewForm({ id }: { id: number }) {
    const [isLoading, setIsLoading] = useState(true);
    const [whatsToUpdateScore, setWhatsToUpdateScore] = useState<boolean>(false);
    const [studentAggregate, setStudentAggregate] = useState<string>('X');
    const [interviewScore, setInterviewScore] = useState({
        agg: 'waiting',
        status: 'pending',
    });
    const [interviewData, setInterviewData] = useState<UpdateInterviewDTO>({
        id: id,
        firstName: '',
        lastName: '',
        otherNames: '',
        previousSchool: '',
        section: '',
        class: '',
        subject: '',
        score: 0,
        status: '',
        issuedBy: '',
        feedback: '',
    });

    const Awards = { 'D1': 1, 'D2': 2, 'C3': 3, 'C4': 4, 'C5': 5, 'C6': 6, 'P8': 8, 'F9': 9 };

    const AvailableClasses = getClassesBySection(interviewData.section as Section);

    const AvailableSubjects = getSubjectsBySection(interviewData.section as Section);

    // Fetch interview data on component mount
    useEffect(() => {
        try {
            const fetchInterviewData = async () => {
                const response = await fetch(`http//192.168.100.169:5000/interviews`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // Handle non-200 responses
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse JSON response
                const data = await response.json();
                setInterviewData(data);
                setIsLoading(false);
            };

            fetchInterviewData();
        } catch (error) {
            console.error("❌ Error fetching interview data:", error);
        }
    }, [id]);

    const handleInterviewChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value.toUpperCase() });
    };
    const handleInterviewFeedbackChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
    };

    const handleInterviewScoreChange = async (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
        await handleGrade(Number(e.target.value));
    };

    const handleAggregateChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value });

        handleStatus(e.target.value);
    };

    const handleDropInterviewChange = (e: any) => {
        setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
    };

    const handleUpdateScore = (e: any) => {
        setWhatsToUpdateScore(true);
    }

    const handleStatus = (Aggregate: string) => {
        const PassAgg = Object.keys(Awards).slice(0, 5); // ['D1', 'D2', 'C3', 'C4', 'C5', 'C6']
        if (PassAgg.includes(Aggregate)) {
            setInterviewScore({ ...interviewScore, status: 'Passed' });
            console.log(studentAggregate);
            console.log('Passed');
        } else {
            setInterviewScore({ ...interviewScore, status: 'Failed' });
            console.log('Failed');
        }


        // if(interviewScore.agg.includes(Awards.keys) || interviewScore.agg.includes(Awards[1]) || interviewScore.agg.includes(Awards[2]) || interviewScore.agg.includes(Awards[3]) || interviewScore.agg.includes(Awards[4]) || interviewScore.agg.includes(Awards[5])){
        //     setInterviewScore({...interviewScore, status: 'Passed'});
        // }else{
        //     setInterviewScore({...interviewScore, status: 'Failed'});
        // }
    }

    const handleGrade = async (grade: number): Promise<string> => {
        try {
            let newAgg = '';

            if (grade >= 90) newAgg = 'D1';
            else if (grade >= 80) newAgg = 'D2';
            else if (grade >= 75) newAgg = 'C3';
            else if (grade >= 65) newAgg = 'C4';
            else if (grade >= 55) newAgg = 'C5';
            else if (grade >= 45) newAgg = 'C6';
            else if (grade >= 39) newAgg = 'P8';
            else newAgg = 'F9';

            const PassAgg = Object.keys(Awards).slice(0, 5); // ['D1', 'D2', 'C3', 'C4', 'C5', 'C6']
            if (PassAgg.includes(newAgg)) {
                setInterviewScore(prev => ({ ...prev, status: 'Passed' }));
            } else {
                setInterviewScore(prev => ({ ...prev, status: 'Failed' }));
            }

            // update state
            setInterviewScore(prev => ({ ...prev, agg: newAgg }));
            setInterviewData(prev => ({ ...prev, status: 'completed' }));
            setStudentAggregate(newAgg);

            // return it for caller
            return newAgg;
        } catch (error) {
            console.error('❌ Error handling grade:', error);
            return ''; // fallback
        }
    };


    const handleInterviewSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        if(!whatsToUpdateScore && (!interviewData.firstName || !interviewData.lastName || !interviewData.otherNames || !interviewData.previousSchool || !interviewData.section || !interviewData.class || !interviewData.subject || !interviewData.status || !interviewData.issuedBy)){
            alert("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }
        if(whatsToUpdateScore && (!interviewData.score || !interviewData.feedback)){
            alert("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }else{
            setInterviewData(prev => ({ ...prev, status: 'Completed' }));
        }

        // Send data to backend
        try {

            const response = await fetch(`http//192.168.100.169:5000/interviews`, {
                method: "PUT", // or 'PUT'
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

    // isLoading && <p>Loading...</p>;
    // // Interview Form
    return (
        <form onSubmit={handleInterviewSubmit} className="p-6 md:p-12">
            {!interviewData?.score ? (<div className='flex flex-col'>
                <span className="text-lg font-semibold text-[#374151]">Interviewee Details</span>
                <span className="text-xs font-light mb-4 text-gray-400">Who is taking on this interview?</span>
            </div>) : (
                <div className='flex md:flex-row gap-4 items-center bg-sky-600 text-gray-50 p-4 rounded mb-4'>
                    <Info />
                    <div className='w-4/5 flex flex-col items-start'>
                        <span className="text-sm font-light text-gray-50">If the interview is done, please award marks accordingly.</span>
                        <button type="button" className="text-xs text-gray-100 underline" onClick={handleUpdateScore}>Click here to proceed</button>
                    </div>
                </div>
            )}

            {whatsToUpdateScore && (<div>
                {/* Name */}
                <div className='flex flex-col gap-4'>

                    <span className='col-span-6'>How has the interviewee performed?</span>
                    <div className='flex flex-col'>
                        <div className='grid grid-cols-6 gap-2 mb-4 text-sm text-gray-500'>
                            <div className="mb-2 col-span-2 md:col-span-3 ">
                                <label className="block text-gray-700 text-sm">Score <span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="score"
                                    value={interviewData.score}
                                    onChange={handleInterviewScoreChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-2 col-span-2 md:col-span-3 ">
                                <label className="block text-gray-700 text-sm">Aggregate<span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="agg"
                                    value={interviewScore.agg}
                                    disabled
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div className="mb-2 col-span-2 md:col-span-3 ">
                                <label className="block text-gray-700 text-sm">Status<span className='text-red-500'>*</span></label>
                                <input
                                    type="text"
                                    name="status"
                                    value={interviewScore.status}
                                    className="w-full p-2 border rounded"
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="mb-2 col-span-6 md:col-span-3 ">
                            <label className="block text-gray-700 text-sm">Feedback <span className='text-red-500'>*</span></label>
                            <textarea
                                name="feedback"
                                value={interviewData.feedback}
                                onChange={handleInterviewFeedbackChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* Other Details */}
                <div className="flex justify-end">
                    <button type="submit" className="bg-[#b91c1c] text-white px-4 py-2 rounded hover:bg-[#dc2626]">
                        {isLoading ? 'Submitting...' : 'Update Score'}
                    </button>
                </div>
            </div>)}

            {!whatsToUpdateScore && (<div>
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
                            required
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
                        <label className="block text-gray-700">Level</label>
                        {interviewData.section !== '' && (
                            <select
                                name="class"
                                value={interviewData?.class}
                                onChange={handleDropInterviewChange}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value=''>Select Level</option>
                                {
                                    AvailableClasses.map((ClassName) => (
                                        <option value={ClassName} key={ClassName}>{ClassName}</option>
                                    ))
                                }
                            </select>
                        )}
                        {
                            interviewData.section === '' && (
                                <select
                                    name="level"
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
                                    {
                                        AvailableSubjects.map((subject) => (
                                            <option value={subject} key={subject}>{subject}</option>
                                        ))
                                    }
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
                                    <option value="Math">Math</option>
                                    <option value="English">English</option>
                                    <option value="Science">Science</option>
                                    <option value="Social Studies">Social Studies</option>
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
                        {isLoading ? 'Submitting...' : 'Update'}
                    </button>
                </div>
            </div>)}
        </form>
    );

};