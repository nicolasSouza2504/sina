"use server"
import CreateUserResponseService from './createUserResponse';
import CreateUserResponseContentService from '../user-response-content/createUserResponseContent';
import type { SubmitTaskPayload } from '@/lib/interfaces/userResponseInterfaces';

/**
 * Serviço combinado para submeter resposta de tarefa
 * 1. Cria o UserResponse (com comentário)
 * 2. Para cada arquivo, cria um UserResponseContent
 */
export default async function SubmitTaskResponseService(payload: SubmitTaskPayload) {
  try {
    console.log('[SubmitTaskResponseService] Iniciando submissão:', {
      taskUserId: payload.taskUserId,
      commentary: payload.commentary,
      filesCount: payload.files.length
    });

    // 1. Criar UserResponse primeiro
    const userResponse = await CreateUserResponseService({
      taskUserId: payload.taskUserId,
      commentary: payload.commentary
    });

    console.log('[SubmitTaskResponseService] UserResponse criado:', {
      userResponseId: userResponse.id,
      taskUserId: userResponse.taskUserId
    });

    // 2. Criar UserResponseContent para cada arquivo
    const uploadedContents = [];
    
    for (let i = 0; i < payload.files.length; i++) {
      const file = payload.files[i];
      
      console.log(`[SubmitTaskResponseService] Uploading arquivo ${i + 1}/${payload.files.length}:`, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });

      // Determinar o contentType baseado no tipo do arquivo
      const contentType = determineContentType(file);

      const userResponseContent = await CreateUserResponseContentService(
        {
          userResponseId: userResponse.id,
          name: file.name,
          contentType: contentType
        },
        file
      );

      uploadedContents.push(userResponseContent);
      
      console.log(`[SubmitTaskResponseService] Arquivo ${i + 1} uploaded:`, {
        contentId: userResponseContent.id,
        contentUrl: userResponseContent.contentUrl
      });
    }

    console.log('[SubmitTaskResponseService] Submissão concluída:', {
      userResponseId: userResponse.id,
      uploadedContentsCount: uploadedContents.length
    });

    return {
      userResponse,
      uploadedContents
    };
  } catch (error) {
    console.error('[SubmitTaskResponseService] Erro na submissão:', error);
    throw error;
  }
}

/**
 * Determina o contentType baseado no tipo MIME do arquivo
 */
function determineContentType(file: File): 'PDF' | 'VIDEO' | 'MP4' | 'JPG' | 'PNG' | 'MP3' | 'DOCX' | 'TEXT' {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // PDF
  if (mimeType.includes('pdf') || fileName.endsWith('.pdf')) {
    return 'PDF';
  }

  // Vídeo
  if (mimeType.includes('video') || fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov')) {
    return 'VIDEO';
  }

  // Imagens
  if (mimeType.includes('image/jpeg') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    return 'JPG';
  }
  if (mimeType.includes('image/png') || fileName.endsWith('.png')) {
    return 'PNG';
  }

  // Áudio
  if (mimeType.includes('audio') || fileName.endsWith('.mp3')) {
    return 'MP3';
  }

  // DOCX
  if (mimeType.includes('wordprocessingml') || fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return 'DOCX';
  }

  // Texto
  if (mimeType.includes('text') || fileName.endsWith('.txt')) {
    return 'TEXT';
  }

  // Default para PDF se não identificar
  return 'PDF';
}
