import { NextRequest, NextResponse } from 'next/server';
import getApiBaseUrl from '@/lib/api/api';
import getTokenFromSession from '@/lib/auth/jwtAuth.server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    const base = getApiBaseUrl();
    const token = await getTokenFromSession();

    // Buscar o arquivo do backend
    const response = await fetch(`${base}/user-response-content/find?filePath=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        Authorization: token
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar arquivo' },
        { status: response.status }
      );
    }

    const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';
    const data = await response.arrayBuffer();

    // Retornar o arquivo como blob
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': 'attachment',
      },
    });
  } catch (error) {
    console.error('Erro ao fazer download de resposta do aluno:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer download do arquivo' },
      { status: 500 }
    );
  }
}
