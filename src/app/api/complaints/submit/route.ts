import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { complaintData } = await request.json();

    // Mock Submission
    // In production, this would use Prisma to save to the database
    
    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
      complaint: {
        id: `CP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        status: "Submitted",
        submittedAt: new Date().toISOString(),
        ...complaintData
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit complaint' }, { status: 500 });
  }
}
