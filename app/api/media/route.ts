import { MediaCreate } from "@/media/DTOSchema";
import { ServiceResult } from "@/media/MediaServiceResult";
import { init } from "@/services/setup";

function buildMediaCreate(body: Buffer, headers: Headers): MediaCreate | null {
  const file_name = headers.get("Portfolio-File-Name");
  const content_length = headers.get("Content-Length");
  const content_type = headers.get("Content-Type");

  if (!file_name || !content_length || !content_type) {
    return null;
  }

  const parsed_content_length = parseInt(content_length);

  if (Number.isNaN(parsed_content_length)) {
    return null;
  }

  return {
    file_name: file_name,
    content_type: content_type,
    size: parsed_content_length,
    data: body,
  };
}

export async function POST(request: Request) {
  try {
    const service_locator = await init();
    const media_script = service_locator.media;

    const media_create = buildMediaCreate(
      Buffer.from(await request.bytes()),
      request.headers,
    );

    if (media_create == null) {
      return new Response("", {
        status: 400,
      });
    }

    const response = await media_script.upload(media_create);

    switch (response.code) {
      case ServiceResult.SUCCESS:
        return new Response("", {
          status: 201,
        });

      case ServiceResult.SERVICE_ERROR:
      default:
        return new Response("", {
          status: 500,
        });
    }
  } catch (e) {
    return new Response("", {
      status: 500,
    });
  }
}
