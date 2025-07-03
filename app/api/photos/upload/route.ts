import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const year = formData.get('year') as string;
    const metadata = JSON.parse(formData.get('metadata') as string);

    if (!file || !year) {
      return NextResponse.json({ error: 'Missing file or year' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Call Lambda function
    const lambdaResponse = await fetch(process.env.UPLOAD_LAMBDA_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileData: buffer.toString('base64'),
        year,
        metadata,
      }),
    });

    const result = await lambdaResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}