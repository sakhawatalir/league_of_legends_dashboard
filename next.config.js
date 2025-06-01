module.exports = {
  reactStrictMode: true,
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  },
  webpack: (config) => {
    // Custom webpack configurations can be added here
    return config;
  },
};