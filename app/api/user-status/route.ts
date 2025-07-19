import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { Schema } from '@/amplify/data/resource';
import { cookies } from 'next/headers';
import config from '@/amplify_outputs.json';

// Configure Amplify for server-side usage
Amplify.configure(config, { ssr: true });

const cookiesClient = generateServerClientUsingCookies<Schema>({
  config,
  cookies,
});

// Get all users with their status
export async function GET() {
  try {
    // Skip database calls during build time
    if (process.env.NODE_ENV === 'production' && !process.env.AWS_EXECUTION_ENV) {
      console.log('🔍 API: Skipping database call during build time');
      return NextResponse.json([], {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    console.log('🔍 API: Fetching all user statuses using Amplify Data client...');
    
    const result = await cookiesClient.models.UserStatus.list({
      authMode: 'apiKey'
    });

    if (result.errors && result.errors.length > 0) {
      console.error('🔍 API: GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    const users = result.data || [];
    console.log('🔍 API: Found users:', users.length);
    
    // Sort by registration date (newest first)
    users.sort((a: any, b: any) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime());
    
    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('🔍 API: Error fetching user statuses:', error);
    
    // In production, provide more specific error guidance
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Database connection failed. Please check authentication.'
      : 'Failed to fetch user statuses';
    
    return NextResponse.json(
      { error: errorMessage, details: String(error) },
      { status: 500 }
    );
  }
}

// Update user status (approve/deny)
export async function PATCH(request: NextRequest) {
  try {
    const { id, status, denialReason } = await request.json();
    
    console.log('🔍 API: Updating user status:', { id, status, denialReason });
    
    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = { status };

    // Add approval/denial date and reason
    if (status === 'approved') {
      updateData.approvalDate = new Date().toISOString();
    } else if (status === 'denied') {
      updateData.denialDate = new Date().toISOString();
      
      if (denialReason) {
        updateData.denialReason = denialReason;
      }
    }

    const result = await cookiesClient.models.UserStatus.update({
      id,
      ...updateData
    }, {
      authMode: 'apiKey'
    });

    if (result.errors && result.errors.length > 0) {
      console.error('🔍 API: GraphQL errors:', result.errors);
      throw new Error(`GraphQL errors: ${result.errors.map((e: any) => e.message).join(', ')}`);
    }

    console.log('🔍 API: User status updated successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🔍 API: Error updating user status:', error);
    return NextResponse.json(
      { error: 'Failed to update user status', details: String(error) },
      { status: 500 }
    );
  }
}
