import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getJinaEmbedding } from '@/lib/jina';

export async function POST(req: NextRequest) {
    try {
        const { content, metadata } = await req.json();

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Content is required and must be a non-empty string' },
                { status: 400 }
            );
        }

        console.log('[Ingest] Processing document, content length:', content.length);

        // 1. Generate embedding using Jina
        const embedding = await getJinaEmbedding(content.trim());
        console.log('[Ingest] Embedding generated, dimension:', embedding.length);

        // 2. Store in Supabase
        const { data, error } = await supabase
            .from('documents')
            .insert({
                content: content.trim(),
                metadata: metadata || {},
                embedding,
            })
            .select('id')
            .single();

        if (error) {
            console.error('[Ingest] Supabase error:', error);
            return NextResponse.json(
                { error: `Database error: ${error.message}` },
                { status: 500 }
            );
        }

        console.log('[Ingest] Document stored with ID:', data.id);

        return NextResponse.json({
            success: true,
            id: data.id,
            message: 'Document ingested successfully',
        });

    } catch (error: any) {
        console.error('[Ingest] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to ingest document' },
            { status: 500 }
        );
    }
}

// GET endpoint to list all documents (for reference)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('id, content, metadata, created_at')
            .order('id', { ascending: false })
            .limit(50);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ documents: data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE endpoint to remove a document
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Document deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
