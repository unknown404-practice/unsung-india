import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, updateSubmissionStatus } from '@/lib/submissions-db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const submissionId = params.id;
    const submission = getSubmissionById(submissionId);

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const rejectionReason = body.rejection_reason || 'Insufficient primary source archival documentation provided.';

    const updated = updateSubmissionStatus(submissionId, 'REJECTED', {
      rejection_reason: rejectionReason,
    });

    return NextResponse.json({
      message: 'Submission status updated to REJECTED.',
      submission: updated,
    });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    return NextResponse.json({ error: 'Failed to reject submission' }, { status: 500 });
  }
}
