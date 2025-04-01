import { MockLogger } from "@/services/logging/__mocks__/Logger";
import { MediaScriptLoggerInstrumentation } from "@/media/MediaScriptLoggerInstrumentation";

const mock_logger = new MockLogger();

beforeEach(() => {
  mock_logger.reset();
});

test("logging upload failed logs the error", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.uploadFailed("testing_this_out");

  expect(mock_logger.last_error_log).toContain("testing_this_out");
});

test("logging missing file fetch logs the file name", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.missingFileForFetch("testing_this_out.png");

  expect(mock_logger.last_error_log).toContain("testing_this_out.png");
});

test("logging fetch failed logs the file name", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.fetchFailed(
    "testing_this_out.png",
    "testing_this_out",
  );

  expect(mock_logger.last_error_log).toContain("testing_this_out.png");
});

test("logging fetch failed logs the error", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.fetchFailed(
    "testing_this_out.png",
    "testing_this_out_error",
  );

  expect(mock_logger.last_error_log).toContain("testing_this_out_error");
});

test("logging missing file on delete logs the file name", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.missingFileForDelete("testing_this_out.png");

  expect(mock_logger.last_error_log).toContain("testing_this_out.png");
});

test("logging delete failed logs the file name", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.deleteFailed(
    "testing_this_out.png",
    "testing_this_out",
  );

  expect(mock_logger.last_error_log).toContain("testing_this_out.png");
});

test("logging delete failed logs the error", () => {
  const media_script_instrumentation = new MediaScriptLoggerInstrumentation(
    mock_logger,
  );

  media_script_instrumentation.deleteFailed(
    "testing_this_out.png",
    "testing_this_out_error",
  );

  expect(mock_logger.last_error_log).toContain("testing_this_out_error");
});
