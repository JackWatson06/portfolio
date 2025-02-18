const test_env_vars = {
  NODE_ENV: "testing",
  NEXT_PORT: "8080",
  MONGODB_DATABASE: "testing",
  MONGODB_USERNAME: "testing",
  MONGODB_PASSWORD: "testing",
  MONGODB_URI: "testing",
  JWT_SECRET: "total_random_32_character_string",
  EXPIRES_OFFSET: "604800000",
  SALT: "16_character_str",
  ADMIN_PASSWORD: "testing",
};

export const load_from_file = jest.fn().mockImplementation(() => {
  return test_env_vars;
});

export const load_from_process = jest.fn().mockImplementation(() => {
  return test_env_vars;
});
