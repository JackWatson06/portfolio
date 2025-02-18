import { ScriptResult } from "@/media/TransactionScriptResult";
import { init } from "@/services/setup";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file_name: string }> },
) {
  try {
    const service_locator = await init();
    const media_script = service_locator.media;

    const media_file = await media_script.read((await params).file_name);

    if (media_file == null) {
      return new Response("", { status: 404 });
    }

    return new Response(media_file.data, {
      headers: {
        "Content-Disposition": "inline",
        "Content-Length": media_file.size.toString(),
        "Content-Type": media_file.content_type,
        "Content-Language": "en-US",
      },
    });
  } catch (e) {
    return new Response("", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ file_name: string }> },
) {
  try {
    const service_locator = await init();
    const media_script = service_locator.media;

    const response = await media_script.delete((await params).file_name);

    switch (response.code) {
      case ScriptResult.NOT_FOUND:
        return new Response("", {
          status: 404,
        });
      case ScriptResult.SUCCESS:
        return new Response("", {
          status: 200,
        });

      case ScriptResult.SERVICE_ERROR:
      default:
        return new Response("", {
          status: 500,
        });
    }
  } catch (e) {
    return new Response("", { status: 500 });
  }
}
